import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    const fetchMeetings = async () => {
        const response = await fetch(`/api/meetings`);
        if (response.ok) {
            const data = await response.json();
            setMeetings(data);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            await fetchMeetings();
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            await fetchMeetings();
        } else {
            alert("Nie można usunąć spotkania z zapisanymi uczestnikami.");
        }
    }

    async function handleSignUp(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: username })
        });
        if (response.ok) {
            await fetchMeetings();
        }
    }

    async function handleSignOut(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants/${username}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await fetchMeetings();
        }
    }

    async function handleUpdateMeeting(meeting, newTitle, newDescription) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, description: newDescription })
        });
        if (response.ok) {
            await fetchMeetings();
        }
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onSignUp={handleSignUp}
                              onSignOut={handleSignOut}
                              onUpdate={handleUpdateMeeting} />}
        </div>
    )
}