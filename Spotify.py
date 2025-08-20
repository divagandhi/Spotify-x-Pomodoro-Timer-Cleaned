import os

from flask import Flask, request, redirect, session, url_for, render_template, jsonify

from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.urandom(64)

client_id = '2ad2068ef23f4b3c885ce176f7d968fa'
client_secret = 'dc511521176f4dd2acc32414dddbce05'
redirect_uri = "http://localhost:5000/callback"
scope = 'playlist-read-private, streaming, user-read-playback-state, user-modify-playback-state'

AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'
# Spotify API URLs for authorization, token exchange, and base API access

cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    redirect_uri=redirect_uri,
    scope=scope,
    cache_handler=cache_handler,
    # Cache Handler stores the token in the flask session
    # So it can be accessed in every page user goes to
    show_dialog=True
)

sp = Spotify(auth_manager=sp_oauth)


@app.route('/') # Home page defined by slash;
# app is Flask app;
# route is a decorator that tells Flask what URL should trigger the function
def home():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    # Redirect to Spotify login page if user is not logged in')
        # Valid token is a proper login that can be used to access the Spotify API
        # Redirect to login page if token is invalid or user not logged in
        #get_cached_token() returns the token stored in the cache
        #get_cached_token() is empty if not logged in,
        # so if we validate get_cached_token and it is empty, it returns false
        return redirect(url_for('get_playlists'))
   # Redirect to get_playlists page if token is valid


@app.route('/callback')
#Spotify comes back here after user logs in and gives code
#Spotify sends back a code (token) to this endpoint
#auth manager stores code and uses it to get access token and refresh token
#so user doesn't have to constantly log in unless I change scope (permissions)
#sp_oauth refreshes token at this endpoint when it expires
def callback():
    sp_oauth.get_access_token(request.args['code'])
    #Gets code (token) coming back from request arguments
    return redirect(url_for('get_playlists'))
@app.route('/get_playlists')
def get_playlists():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    
    playlists = sp.current_user_playlists()
    playlists_info = [(pl['name'], pl['external_urls']['spotify']) for pl in playlists['items']]
    # Get the user's playlists using the Spotify API
    return render_template('index.html', playlists=playlists_info)
    # Pass the playlists data to index.html
@app.route('/api/playlists')
def get_playlists_api():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return jsonify({'error': 'unauthorized'}), 401

    playlists = sp.current_user_playlists()
    playlists_info = [
        [
            pl['name'],
            pl['external_urls']['spotify'],
            pl['images'][0]['url'] if pl['images'] else None
        ] for pl in playlists['items']
    ]

    return jsonify(playlists_info)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

if (__name__) == '__main__':
    app.run(debug=True)