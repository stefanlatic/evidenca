
const WelcomeMessage = ({ userData }) => {
    return <>
        <div className="bg-white p-3 rounded-2xl shadow-xl text-center flex items-center justify-center">
        <div className="inline-block">
            <img src="/doctor.jpg" alt="doctor" className="w-[200px]"></img>
        </div>
        <div>
        <h2>Zdravo {userData?.name || "korisniče"}!</h2>
        <p>Drago nam je da vidimo da brines o svom zdravlju!
        Mi smo tu da ti pomognemo da vodis racuna o tvojoj evidenciji pregleda, vakcinacija, lekova i td. Tu smo da te podsetimo na predstojece preglede, vreme za tvoj lek i jos neke vazne stvari...  </p>
        </div>
        </div>
       
    </>
}

export default WelcomeMessage;