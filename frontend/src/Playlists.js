import React, { useEffect, useState } from 'react';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
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

    const renderPlaylists = () => (
    <div className="playlist-container">
      {playlists.map((pl, idx) => (
        <div key={idx} className="playlist-card">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${pl[1].split("/")[4]}`}
            width="300"
            height="380"
            allow="encrypted-media"
            title={`Spotify Playlist: ${pl[0]}`}
          ></iframe>
        </div>
      ))}
    </div>
  );


  if (loading) return <p>Drumroll please...</p>;
  if (error) return <p>Error: {error}</p>;
  if (playlists.length === 0) return <p>No playlists found.</p>;

  return (
    <div>
      {renderPlaylists()}
    </div>
  );
};

export default Playlists;
