import { useState } from 'react';
import { subscribe } from '../api';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await subscribe(email);
      setEmail('');
      setMessage('You are subscribed. The next sales field note is on the way.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not subscribe right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <div className="newsletter-input-row">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required disabled={busy} />
        <button disabled={busy}>{busy ? 'Subscribing...' : 'Subscribe'}</button>
      </div>
      {message && <p className={`newsletter-message ${message.includes('subscribed') ? 'success' : 'error'}`}>{message}</p>}
    </form>
  );
}
