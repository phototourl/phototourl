import LegalPage from "@/components/LegalPage";

export default function ImpressumPage() {
  return (
    <LegalPage>
      <h1 className="text-3xl font-bold">Impressum</h1>
      <p className="mt-4 text-slate-700">Operator: Photo to URL</p>
      <p className="mt-2 text-slate-700">
        Contact: <a className="text-blue-600 hover:underline" href="mailto:leeqs1010@gmail.com">leeqs1010@gmail.com</a>
      </p>
    </LegalPage>
  );
}


