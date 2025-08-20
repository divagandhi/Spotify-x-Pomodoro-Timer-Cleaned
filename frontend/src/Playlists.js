import React, { useEffect, useState } from 'react';

const fetchPlaylists = async (setPlaylists, setLoading, setError) => {
    try {
        const response = await fetch('/api/playlists');
        if (!response.ok) throw new Error('Failed to fetch playlists');
        const data = await response.json();
        setPlaylists(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

const renderPlaylists = (playlists) => (
    <div className="playlist-container">
        {playlists.map((pl) => {
            const playlistId = pl[1].split("/")[4];
            return (
                <div key={playlistId} className="playlist-card">
                    <iframe
                        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
                        width="300"
                        height="380"
                        allow="encrypted-media"
                        title={`Spotify Playlist: ${pl[0]}`}
                    ></iframe>
                </div>
            );
        })}
    </div>
);

const LoadingMessage = ({ loading }) => {
    return loading ? <p>Drumroll please...</p> : null;
};

const ErrorMessage = ({ error }) => {
    return error ? <p>Error: {error}</p> : null;
};

const EmptyMessage = ({ playlists }) => {
    return playlists.length === 0 ? <p>No playlists found.</p> : null;
};

const shouldRenderPlaylists = (loading, error, playlists) => {
    return !loading && !error && playlists.length > 0;
};

const Playlists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlaylists(setPlaylists, setLoading, setError);
    }, []);

    return (
        <div>
            <LoadingMessage loading={loading} />
            <ErrorMessage error={error} />
            <EmptyMessage playlists={playlists} />
            {shouldRenderPlaylists && renderPlaylists(playlists)}
        </div>
    );
};

export default Playlists;
