import Link from "next/link";

const languages = [
  { slug: "english", name: "English", flag: "🇺🇸" },
  { slug: "spanish", name: "Español", flag: "🇪🇸" },
  { slug: "portuguese", name: "Português", flag: "🇧🇷" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-r from-white to-blue-200 flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          MediChat
        </h1>
        <div className="space-y-4 overflow-y-auto max-h-64">
          {languages.map((lang) => (
            <Link
              key={lang.slug}
              href={`/language/${lang.slug}`}
              className="block w-full bg-[rgb(122,202,228)] text-white px-6 py-4 rounded-lg text-lg font-medium hover:bg-[rgb(100,180,210)] transition-colors text-center"
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
