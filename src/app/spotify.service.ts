import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SpotifyService {

	authorizeURL = 'https://accounts.spotify.com/authorize';
	clientId = '7fafbce74b0b4d78868fbdc6d6b1858b';
	responseType = 'token';
	redirectURI = "https://" + window.location.hostname;
	scope = ['user-read-email',
	'user-read-currently-playing', 
	'user-modify-playback-state',
	'streaming',
	'user-read-playback-state',
	'user-read-private',
	'user-top-read',
	'user-read-email'].join('%20');

	baseUrl: string = 'https://api.spotify.com/v1';

	constructor(private http: HttpClient) { }

	user() { 
		return this.http.get(this.baseUrl + '/me');
	}

	getAuthUrl() {
		this.authorizeURL += "?" + "client_id=" + this.clientId;
		this.authorizeURL += "&response_type=" + this.responseType;
		this.authorizeURL += "&redirect_uri=" + this.redirectURI;
		this.authorizeURL += "&scope=" + this.scope;
		return this.authorizeURL;
	}

	search(terms: Observable<string>) {
		return terms.pipe(
			debounceTime(400),
			distinctUntilChanged()).pipe(switchMap(
				term => term ? 
				this.searchEntries(term)
				:
				of([]) 
				))
		}

		searchEntries(term) {
			return this.http.get(this.baseUrl + "/search?type=track,album,artist&q=" + term);
		}

		playTrack(uri: string) {
			let bodyObj = {
				"uris": [uri]
			}

			console.log("attempting to play ", uri);

			return this.http.put(this.baseUrl + "/me/player/play", JSON.stringify(bodyObj))

		}
	}
