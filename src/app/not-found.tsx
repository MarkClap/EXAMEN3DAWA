// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Página no encontrada</h1>
      <p style={styles.text}>La página que buscas no existe.</p>
      <Link href="/" className="text-blue-600 underline mt-4 inline-block">
        Volver al inicio
      </Link>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    textAlign: 'center',
    padding: '4rem',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#e63946',
  },
  text: {
    fontSize: '1.2rem',
    marginTop: '1rem',
  },
};
