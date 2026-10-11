# Templates dos e-mails de autenticação (Supabase)

Os e-mails de autenticação são enviados pelo Supabase Auth, pelo SMTP do Resend (Bloco 59 do Master Plan). Os textos ficam versionados aqui e são colados no painel em **Authentication → Emails → Templates**.

| Template no Supabase | Assunto | Arquivo |
|---|---|---|
| Confirm signup | Confirme seu e-mail no GSeller | `confirmar-cadastro.html` |
| Reset password | Redefina sua senha do GSeller | `redefinir-senha.html` |
| Change email address | Confirme seu e-mail no GSeller | `alterar-email.html` |

- **Change email address** também é o e-mail de quem sai do modo demonstração e cria a conta (`updateUser({ email })`, Bloco 58.2).
- Os links usam `{{ .ConfirmationURL }}`, que leva a `/auth/confirm` com o fluxo PKCE já tratado pelo frontend.
- Ao mudar um texto, altere o arquivo aqui **e** o painel, no mesmo PR.

## SMTP do Resend no Supabase (issue #31)

**Authentication → Emails → SMTP Settings → Enable custom SMTP**

| Campo | Valor |
|---|---|
| Sender email | `nao-responda@avisos.<seu-dominio>` |
| Sender name | `GSeller` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | chave do Resend **só de envio** (Sending access), exclusiva do Supabase |
