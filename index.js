function loginClicked(musickitInstance) {
    musickitInstance.authorize();
    const div = document.getElementById('content');
    let htmlString = "";
    htmlString += "<label for='year'>Enter festival year (blank for most recent):</label><br>";
    htmlString += "<input type='text' id='year' value='2022'><br>";
    htmlString += "<button id='getLineup'>Get Your Lineup!</button>";
    div.innerHTML = htmlString;

    document.getElementById('getLineup').addEventListener('click', async function () {
        const festYear = document.getElementById('year').value;
        const topArtists = await getTopArtists(music, festYear);
        console.log(topArtists);
    })
}

async function getTopArtists(musickitInstance, year=2022) {

    const music = musickitInstance;

    // TODO: Figure out how to deal with empty input
    if (isNaN(year)) {
        year = 2022;
    }

    const REPLAY_NAME = 'Replay ' + year;

    const result = await music.api.music('v1/me/library/playlists');
    const playlists = result.data.data;

    let replay2022URL = null;
    for (let i = 0; i < playlists.length; i++) {
        const currList = playlists[i];
        if (currList.attributes.name === REPLAY_NAME) {
            replay2022URL = currList.href;
        }
    }

    // Handle case where replay2022URL is null (playlist not in library)
    const replay2022Songs = await music.api.music(replay2022URL + '/tracks');
    const replay2022TrackList = replay2022Songs.data.data;
    console.log(replay2022TrackList);

    // Artist name mapped to total score. Artists receive 100 points if their song is first on the replay playlits, 99 if second, 98...
    // etc all the way to 1 point for having the 100th song on the playlist
    let weightedArtistAppearances = new Map();

    // Populate weightedArtistAppearances with artists scores
    for (let i = 0; i < replay2022TrackList.length; i++) {

        let artistName = replay2022TrackList[i].attributes.artistName;
        if (artistName.includes('&')) {
            continue;
            // artistName = artistName.split(/\s*[,&]\s*/)[0];
        }
        // let artists = [];
        // if (artistName.includes('&')) {
        //     artists = artistName.split(/\s*[,&]\s*/);
        // } else {
        //     artists = [artistName];
        // }

        // for (let j = 0; j < artists.length; j++) {
        //     weightedArtistAppearances.set(artists[j], weightedArtistAppearances.get(artists[j]) + (100-i) || 100-i);
        // }
        weightedArtistAppearances.set(artistName, weightedArtistAppearances.get(artistName) + (100-i) || 100-i);
    }
    // sort weightedArtistApparances by score
    weightedArtistAppearances = new Map([...weightedArtistAppearances.entries()].sort((a,b) => b[1] - a[1]))
    console.log(weightedArtistAppearances);
    return Array.from(weightedArtistAppearances.keys()).slice(0,36);

    // TODOS:
    // Now we have the top up to 36 artists, based on our proprietary scoring system and discarding multiple-artist songs.
    // Next, we'll use canvas to draw the artist names in a festival-lineup format onto the base image at default_background.png
    // Then we'll present that image on the screen along with a button that allows the user to download the image
    // Also, lets have it all hidden behind a button "Get your lineup!" that once you click it then it triggers
    // Apple Music authorization and everything after that.
    // Let's also add the abililty (right after authorization) to input the year you want your lineup for and then
    // that will inform which playlist we use ('2019' for 'Replay 2019', e.g.)
}

let music = null;

document.addEventListener('musickitloaded', async function () {
    // Call configure() to configure an instance of MusicKit on the Web.
    console.log("MusicKitLoaded event fired!");
    try {
        await MusicKit.configure({
            developerToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjlLOENVODM2VVIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJTMzhCUTM3UlNHIiwiZXhwIjoxNjg1NTcwMzE5LCJpYXQiOjE2Njk3OTc5MTN9.sEzGYZEW91Sfbm4ysj44zaiDDVPPt-ZJESs317ouAvHAn_CH4yRCplAVZuOiI5y3jzwEZ505F5jJVhMnKzU0jQ',
            app: {
                name: 'AppleMusicFest',
                build: '1978.4.1',
            },
        });
        console.log("MusicKit configured!");
    } catch (err) {
        alert("Unable to configure your MusicKit instance. Please ensure that your developer token is valid.")
    }

    music = MusicKit.getInstance();
});

const loginButton = document.getElementById('login');
loginButton.addEventListener('click', function() {
    loginClicked(music);
});

// const getLineupButton = document.getElementById('getLineup');
// getLineupButton.addEventListener('click', async function () {
//     const festivalYear = document.getElementById('year').value;
//     const topArtists = await getTopArtists(music, festivalYear).then(
//         result => result
//     );
//     console.log(topArtists);
// })
