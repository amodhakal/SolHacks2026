"use client";

import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

type Language = "english" | "spanish" | "portuguese";

const translations: Record<Language, Record<string, string>> = {
  english: {
    title: "Patient Intake Form",
    introduction:
      "This website is designed to provide translation services for users. It offers a user-friendly interface where users can input text in one language and receive translations in another language.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    dob: "Date of Birth",
    insurance: "Do you have insurance?",
    phone: "Doctor's Phone Number",
    whoToVisit: "Medical Department",
    additionalInfo: "Additional Information",
    submit: "Submit",
    yes: "Yes",
    no: "No",
    selectOption: "--Please choose an option--",
    doctor: "Doctor",
    eyeDoctor: "Eye Doctor",
    dentist: "Dentist",
    pediatrician: "Pediatrician",
    psychiatrist: "Psychiatrist",
    other: "Other",
  },
  spanish: {
    title: "Formulario de Admisión del Paciente",
    introduction:
      "Este sitio web está diseñado para proporcionar servicios de traducción. Ofrece una interfaz fácil de usar.",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    dob: "Fecha de Nacimiento",
    insurance: "¿Tiene seguro médico?",
    phone: "Número de Teléfono del Doctor",
    whoToVisit: "Departamento Médico",
    additionalInfo: "Información Adicional",
    submit: "Enviar",
    yes: "Sí",
    no: "No",
    selectOption: "--Por favor elija una opción--",
    doctor: "Doctor",
    eyeDoctor: "Oculista",
    dentist: "Dentista",
    pediatrician: "Pediatra",
    psychiatrist: "Psiquiatra",
    other: "Otro",
  },
  portuguese: {
    title: "Formulário de Admissão do Paciente",
    introduction:
      "Este site foi projetado para fornecer serviços de tradução. Oferece uma interface fácil de usar.",
    firstName: "Nome",
    lastName: "Sobrenome",
    email: "Endereço de Email",
    dob: "Data de Nascimento",
    insurance: "Você tem seguro?",
    phone: "Número de Telefone do Médico",
    whoToVisit: "Departamento Médico",
    additionalInfo: "Informações Adicionais",
    submit: "Enviar",
    yes: "Sim",
    no: "Não",
    selectOption: "--Por favor escolha uma opção--",
    doctor: "Médico",
    eyeDoctor: "Oftalmologista",
    dentist: "Dentista",
    pediatrician: "Pediatra",
    psychiatrist: "Psiquiatra",
    other: "Outro",
  },
};

export default function LanguagePage({ params }: PageProps) {
  const { slug } = use(params);
  const lang = (slug as Language) || "english";
  const t = translations[lang] || translations.english;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      dob: formData.get("dob"),
      insurance: formData.get("insurance"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      medical_department: formData.get("medical_department"),
      additionalInfo: formData.get("additionalInfo"),
      language: lang,
    };
    console.log("Form submitted:", data);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-white to-blue-200 flex items-center justify-center p-5  text-gray-800">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">{t.title}</h1>
        <p className="text-gray-600 text-center mb-6">{t.introduction}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.firstName}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)]"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.lastName}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)]"
            />
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.dob}
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.insurance}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="insurance"
                  value="yes"
                  required
                  className="mr-2"
                />
                {t.yes}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="insurance"
                  value="no"
                  className="mr-2"
                />
                {t.no}
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.phone}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)]"
            />
          </div>

          <div>
            <label
              htmlFor="medical_department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.whoToVisit}
            </label>
            <select
              id="medical_department"
              name="medical_department"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)]"
            >
              <option value="">{t.selectOption}</option>
              <option value="Doctor">{t.doctor}</option>
              <option value="Eye Doctor">{t.eyeDoctor}</option>
              <option value="Dentist">{t.dentist}</option>
              <option value="Pediatrician">{t.pediatrician}</option>
              <option value="Psychiatrist">{t.psychiatrist}</option>
              <option value="Other">{t.other}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t.additionalInfo}
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(122,202,228)] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[rgb(122,202,228)] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[rgb(100,180,210)] transition-colors cursor-pointer"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
