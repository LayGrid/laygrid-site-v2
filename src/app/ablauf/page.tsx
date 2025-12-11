export default function Ablauf() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">So funktioniert es</h1>
      <ol className="grid gap-6 md:grid-cols-2">
        <li className="rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Schritt 1</div>
          <div className="font-semibold">Vermessung</div>
          <p>Wir messen Maschinen und Medien vor Ort.</p>
        </li>
        <li className="rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Schritt 2</div>
          <div className="font-semibold">3D Druck</div>
          <p>Massstäbliche Bauklötze deiner Assets.</p>
        </li>
        <li className="rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Schritt 3</div>
          <div className="font-semibold">Layout</div>
          <p>Physisch am Tisch oder digital planen.</p>
        </li>
        <li className="rounded-lg border p-4 shadow-sm">
          <div className="text-sm text-gray-500">Schritt 4</div>
          <div className="font-semibold">Abnahme</div>
          <p>Teilen mit Partnern dank BIM.</p>
        </li>
      </ol>
    </main>
  );
}
