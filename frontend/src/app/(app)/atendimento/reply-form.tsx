"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { findContactLeak, QUICK_REPLIES } from "@/lib/demo/support";

/** Resposta com respostas prontas editáveis e a trava de contato fora da plataforma. */
export function ReplyForm() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <p role="status" className="rounded-md bg-success-soft p-3 text-sm text-success">
        Resposta enviada: “{sent}”
      </p>
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reply = text.trim();
    if (!reply) return;
    const leak = findContactLeak(reply);
    if (leak) {
      setError(leak);
      return;
    }
    setSent(reply);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {QUICK_REPLIES.map((reply) => (
          <Button
            key={reply.label}
            variant="secondary"
            onClick={() => {
              setText(reply.text);
              setError(null);
            }}
          >
            {reply.label}
          </Button>
        ))}
      </div>
      <label className="block">
        <span className="sr-only">Sua resposta</span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          rows={4}
          maxLength={2000}
          placeholder="Escreva ou escolha uma resposta pronta"
          aria-invalid={error ? true : undefined}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-md bg-danger-soft p-3 text-sm text-danger">
          {error}
        </p>
      )}
      <Button type="submit" disabled={!text.trim()}>
        Responder
      </Button>
    </form>
  );
}
