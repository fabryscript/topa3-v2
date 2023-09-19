import UploadBox from '../components/UploadBox';

export default function WelcomeScreen() {
  return (
    <main className="text-white px-10">
      <div className="flex w-full h-screen items-center justify-evenly gap-20">
        <div className="flex flex-col gap-5">
          <h1 className="text-5xl font-semibold">
            Ciao! 👋🏼 <br /> Mi chiamo TOPA3
          </h1>
          <p className="opacity-50">
            Sono il tuo assistente personale dedicato ad incrementare la tua
            produttività. <br /> Inizia pure importando il tuo primo file
            <code> _topa3</code>.
          </p>
        </div>
        <UploadBox />
      </div>
    </main>
  );
}
