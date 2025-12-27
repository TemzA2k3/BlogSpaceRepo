# Contact API Reference

API для формы обратной связи.

## Base URL

```
/contact
```

## Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | / | Отправка сообщения | ❌ |

---

## POST /contact

Отправка сообщения через форму обратной связи.

### Request

```http
POST /contact
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "general",
  "message": "I have a question about your platform..."
}
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| name | string | ✅ | Имя отправителя |
| email | string | ✅ | Email для ответа |
| subject | string | ✅ | Тема обращения |
| message | string | ✅ | Текст сообщения |

### Допустимые значения subject

| Значение | Описание |
|----------|----------|
| general | Общий вопрос |
| technical | Техническая проблема |
| billing | Вопрос по оплате |
| partnership | Сотрудничество |
| feedback | Отзыв или предложение |
| other | Другое |

### Response

**201 Created**
```json
{
  "success": true
}
```

**400 Bad Request** — Ошибка валидации
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "email must be an email",
    "subject should not be empty",
    "message should not be empty"
  ],
  "error": "Bad Request"
}
```

### Examples

**Общий вопрос:**
```bash
curl -X POST http://localhost:8080/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "general",
    "message": "How can I reset my password?"
  }'
```

**Техническая проблема:**
```bash
curl -X POST http://localhost:8080/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "technical",
    "message": "I cannot upload images to my posts. Getting error 413."
  }'
```

**Предложение о сотрудничестве:**
```bash
curl -X POST http://localhost:8080/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Wilson",
    "email": "bob@company.com",
    "subject": "partnership",
    "message": "We would like to discuss API integration possibilities."
  }'
```

**Отзыв:**
```bash
curl -X POST http://localhost:8080/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Brown",
    "email": "alice@example.com",
    "subject": "feedback",
    "message": "Great platform! The article editor is amazing."
  }'
```

---

## JavaScript Example

```javascript
const sendContactMessage = async (formData) => {
  const response = await fetch('http://localhost:8080/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

// Использование
try {
  await sendContactMessage({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'general',
    message: 'Hello, I have a question...',
  });
  alert('Message sent successfully!');
} catch (error) {
  alert('Error: ' + error.message);
}
```

---

## React Form Example

```jsx
import { useState } from 'react';

const SUBJECTS = [
  { value: 'general', label: 'General Question' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
];

export const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(Array.isArray(data.message) 
          ? data.message.join(', ') 
          : data.message
        );
      }

      setSuccess(true);
      setForm({ name: '', email: '', subject: 'general', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div>Message sent successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      
      <input
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      
      <select
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      >
        {SUBJECTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      
      <textarea
        placeholder="Your message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
```
