
const WelcomeMessage = () => {
    return <>
        <div className="bg-white p-3 rounded-2xl shadow-xl text-center flex items-center justify-center">
        <div className="inline-block">
            <img src="/doctor.jpg" alt="doctor" className="h-36"></img>
        </div>
        <div>
        <h2>Zdravo name!</h2>
        <p className="w-[600px]">Drago nam je da vidimo da brines o svom zdravlju!
        Mi smo tu da ti pomognemo da vodis racuna o tvojoj evidenciji pregleda, vakcinacija, lekova i td. Tu smo da te podsetimo na predstojece preglede, vreme za tvoj lek i jos neke vazne stvari...  </p>
        </div>
        </div>
       
    </>
}

export default WelcomeMessage;