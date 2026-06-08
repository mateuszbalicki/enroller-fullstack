import {useState} from "react";

export default function NewMeetingForm({onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');

    function submit(event) {
        event.preventDefault();

        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;

        if (!dateRegex.test(date)) {
            setDateError('Niepoprawny format daty. Wymagany format to dd.mm.yyyy (np. 12.06.2026).');
            return;
        }

        setDateError('');
        onSubmit({title, description, date, participants: []});
    }

    return (
        <form onSubmit={submit}>
            <h3>Dodaj nowe spotkanie</h3>
            <label>Nazwa</label>
            <input type="text" value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <label>Opis</label>
            <textarea value={description}
                      onChange={(e) => setDescription(e.target.value)}></textarea>
            
            <label>Data</label>
            <input 
                type="text" 
                value={date}
                placeholder="np. 24.12.2026"
                onChange={(e) => setDate(e.target.value)}
                required 
            />
            
            {dateError && (
                <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.4rem' }}>
                    {dateError}
                </div>
            )}

            <button>Dodaj</button>
        </form>
    );
}