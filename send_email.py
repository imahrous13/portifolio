import argparse
import os
import smtplib
from email.message import EmailMessage
from typing import List, Optional


def _safe_bool(value: Optional[str], default: bool = False) -> bool:
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "y", "on"}


def _load_dotenv_if_available() -> None:
    try:
        # Optional dependency; the script still works without it
        from dotenv import load_dotenv  # type: ignore

        load_dotenv()
    except Exception:
        # Silently ignore if python-dotenv isn't installed
        pass


def _get_env(name: str, default: Optional[str] = None) -> Optional[str]:
    value = os.getenv(name, default if default is not None else None)
    return value


def _build_email_message(
    sender_address: str,
    recipient_addresses: List[str],
    subject: str,
    body: str,
    is_html: bool,
) -> EmailMessage:
    message = EmailMessage()
    message["From"] = sender_address
    message["To"] = ", ".join(recipient_addresses)
    message["Subject"] = subject
    if is_html:
        message.add_alternative(body, subtype="html")
    else:
        message.set_content(body)
    return message


def send_email(
    smtp_host: str,
    smtp_port: int,
    username: str,
    password: str,
    use_ssl: bool,
    use_tls: bool,
    sender_address: str,
    recipient_addresses: List[str],
    subject: str,
    body: str,
    is_html: bool,
) -> None:
    if use_ssl and use_tls:
        raise ValueError("Do not enable both SSL and TLS simultaneously. Choose one.")

    message = _build_email_message(
        sender_address=sender_address,
        recipient_addresses=recipient_addresses,
        subject=subject,
        body=body,
        is_html=is_html,
    )

    if use_ssl:
        with smtplib.SMTP_SSL(host=smtp_host, port=smtp_port) as smtp:
            smtp.login(user=username, password=password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host=smtp_host, port=smtp_port) as smtp:
            if use_tls:
                smtp.starttls()
            smtp.login(user=username, password=password)
            smtp.send_message(message)


def main() -> None:
    _load_dotenv_if_available()

    default_to = _get_env("DEFAULT_TO", "imahrous13@gmail.com")

    parser = argparse.ArgumentParser(description="Simple SMTP email sender (Gmail-ready)")
    parser.add_argument(
        "--to",
        nargs="+",
        default=[default_to] if default_to else None,
        help="Recipient email address(es). Defaults to DEFAULT_TO env or imahrous13@gmail.com",
    )
    parser.add_argument("--subject", required=True, help="Email subject")
    body_group = parser.add_mutually_exclusive_group(required=True)
    body_group.add_argument("--text", help="Plain text body content")
    body_group.add_argument("--html", help="HTML body content")
    parser.add_argument(
        "--from",
        dest="from_addr",
        default=_get_env("EMAIL_FROM") or _get_env("EMAIL_USER"),
        help="From address. Defaults to EMAIL_FROM or EMAIL_USER",
    )
    parser.add_argument(
        "--smtp-host",
        default=_get_env("SMTP_HOST", "smtp.gmail.com"),
        help="SMTP server host (default: smtp.gmail.com)",
    )
    parser.add_argument(
        "--smtp-port",
        type=int,
        default=int(_get_env("SMTP_PORT", "465")),
        help="SMTP server port (default: 465 for SSL)",
    )
    parser.add_argument(
        "--username",
        default=_get_env("EMAIL_USER"),
        help="SMTP username (default: EMAIL_USER env)",
    )
    parser.add_argument(
        "--password",
        default=_get_env("EMAIL_PASS"),
        help="SMTP password or app password (default: EMAIL_PASS env)",
    )
    parser.add_argument(
        "--ssl",
        action="store_true",
        default=_safe_bool(_get_env("SMTP_USE_SSL"), True),
        help="Use SSL (default: true)",
    )
    parser.add_argument(
        "--tls",
        action="store_true",
        default=_safe_bool(_get_env("SMTP_USE_TLS"), False),
        help="Use STARTTLS (default: false)",
    )

    args = parser.parse_args()

    if not args.username or not args.password:
        raise SystemExit(
            "Missing credentials. Set EMAIL_USER and EMAIL_PASS env vars or pass --username/--password."
        )

    if not args.from_addr:
        raise SystemExit(
            "Missing sender address. Set EMAIL_FROM or EMAIL_USER env vars, or pass --from"
        )

    is_html = args.html is not None
    body = args.html if is_html else args.text

    recipients: List[str] = args.to if args.to else []
    if not recipients:
        raise SystemExit("No recipients provided. Use --to or set DEFAULT_TO in environment.")

    send_email(
        smtp_host=args.smtp_host,
        smtp_port=args.smtp_port,
        username=args.username,
        password=args.password,
        use_ssl=bool(args.ssl),
        use_tls=bool(args.tls),
        sender_address=args.from_addr,
        recipient_addresses=recipients,
        subject=args.subject,
        body=body,
        is_html=is_html,
    )


if __name__ == "__main__":
    main()

