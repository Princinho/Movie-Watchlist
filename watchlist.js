
const apikey='24da6167'
let films=[]
const mainDefaultHtml=`
<div class="placeholder" id="placeholder">
    <h3>Your watchlist is looking a little empty...</h3>
    <a href="index.html" class="action-link">
        <img src="img/add.png" class="action-img" alt="plus-button">
        Let's add some movies!
    </a>
</div>
<div id="not-found-text" class="placeholder">
    <h3>
        Unable to find what you're looking for. Please try another search.
    </h3>
</div>`

const main=document.getElementById('main')
if(localStorage.getItem('watchlist')){
    films=JSON.parse(localStorage.getItem('watchlist'))
    if(films.length>0)
    displayFilms(films)
}else{
    console.log('no films in watchlist')
}

function displayFilms(films){
    const requests=films.map(id=>fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apikey}`))
    Promise.all(requests).then(
        responses=>{
            console.log(responses)
            Promise.all(responses.map(r=>r.json()))
            .then(data=>{
                console.log(data)
                document.getElementById('main')
                .innerHTML=getFilmsHtmlWatchlist(data)
            })
        })
        .catch(err=>{
            console.error(err)
        })
}

function isFavorite(filmId){
    if(!localStorage.getItem('watchlist'))return false
    return JSON.parse(localStorage.getItem('watchlist')).some(e=>e==filmId)

}
function getFilmsHtmlWatchlist(films){
    let html=``

    for(let film of films){
        const button= `<button class="btn-action" onClick="removeFromWatchlist('${film.imdbID}',this)">
        <img src="./img/remove.png">
        Watchlist
    </button>`
        html+=`<div class="movie" data-movie-id="${film.imdbID}">
        <img class="movie-poster" src="${film.Poster}"/>
        <div class="movie-details-container">
            <div class="movie-title-bar">
                <h3 class="movie-title">${film.Title}</h3>
                <img src="./img/star.png">
                <span class="movie-rating">${film.imdbRating}</span>
            </div>
            <div class="movie-info-bar">
                <span class="movie-duration">${film.Runtime}</span>
                <span class="movie-tags">${film.Genre}</span>
                ${button}
            </div>
            <p class="synopsis">
                ${film.Plot}...<span class="read-more">Read more</span>
            </p>
        </div>
    </div>`
    }
    return html
}


function removeFromWatchlist(movieId,target){
    if(localStorage.getItem('watchlist')){
        let previous=JSON.parse(localStorage.getItem('watchlist'))
        const newWatchlist=previous.filter(id=>id!==movieId)
        if(newWatchlist.length==0) {
            document.getElementById('main').innerHTML=mainDefaultHtml
            localStorage.removeItem("watchlist")
        }
        localStorage.setItem('watchlist',JSON.stringify(newWatchlist))
    }else{
        localStorage.setItem('watchlist',JSON.stringify([movieId]))
    }
    target.parentNode.parentNode.parentNode.style.display='none'
}