import { useState } from "react";
import './MeetingsList.css';

export default function MeetingsList({meetings, username, onDelete, onSignUp, onSignOut, onUpdate}) {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    function startEditing(meeting) {
        setEditingId(meeting.id);
        setEditTitle(meeting.title);
        setEditDescription(meeting.description);
    }

    function saveEditing(meeting) {
        onUpdate(meeting, editTitle, editDescription);
        setEditingId(null);
    }

    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                <th>Data</th>
                <th style={{ textAlign: 'center' }}>Zapisanych</th>
                <th>Akcje uczestnika</th>
                <th>Akcje administratora</th>
            </tr>
            </thead>
            <tbody>
            {
                meetings.map((meeting, index) => {
                    const participantsList = meeting.participants || [];
                    const participantsCount = participantsList.length;
                    const isSignedUp = participantsList.some(p => p.login === username);
                    const isEditing = editingId === meeting.id;
                    const isFull = participantsCount >= 10;

                    return (
                        <tr key={index}>
                            <td>
                                {isEditing ?
                                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                    : meeting.title}
                            </td>
                            <td>
                                {isEditing ?
                                    <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                                    : meeting.description}
                            </td>
                            <td>{meeting.date}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{ color: isFull ? 'red' : 'inherit', fontWeight: isFull ? 'bold' : 'normal' }}>
                                    {participantsCount} / 10
                                </span>
                            </td>
                            <td>
                                {isSignedUp ?
                                    <button className="button button-outline button-red" onClick={() => onSignOut(meeting)}>Wypisz się</button>
                                    : 
                                    <button 
                                        className="button button-outline" 
                                        onClick={() => onSignUp(meeting)}
                                        disabled={isFull}
                                        title={isFull ? "Brak wolnych miejsc" : ""}
                                    >
                                        Zapisz się
                                    </button>
                                }
                            </td>
                            <td>
                                {isEditing ? (
                                    <button className="button button-outline" onClick={() => saveEditing(meeting)}>Zapisz</button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="button button-outline" onClick={() => startEditing(meeting)}>Edytuj</button>
                                        <button className="button button-outline button-red" onClick={() => onDelete(meeting)}>Usuń</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    );
}