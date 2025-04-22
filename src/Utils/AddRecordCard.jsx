
const AddRecordCard = () => {


    return (
        <>
        <div className="bg-white p-3 rounded-2xl shadow-xl text-center flex items-center justify-center">
          <div className="flex flex-col">
            <h1 className="text-[#0550b3] font-medium">Dodaj evidenciju</h1>
            <label for="records">Tip</label>
            <select name="records" >
            <option value="Lekarski pregledi">Lekarski pregledi</option>
            <option value="Vakcinacije"> Vakcinacije</option>
            <option value="Laboratorijski testovi">Laboratorijski testovi</option>
            <option value="Rehabilitacija i terapije">Rehabilitacija i terapije</option>
            </select>
          </div>
        </div>
        </>
    )
}

export default AddRecordCard;