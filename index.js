//https://www.omdbapi.com/?s=blade&apikey=24da6167
const apikey='24da6167'
const searchInput=document.getElementById('search-input')
const searchButton=document.getElementById('btn-search')
const films=[]
searchInput.addEventListener('keypress',(ev)=>{
    if(ev.key=='Enter'){
        console.log('Search for '+searchInput.value)
        getFilms(searchInput.value)
    }
})
searchButton.addEventListener('click',()=>getFilms(searchInput.value))
function getFilms(searchQuery){
    fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${apikey}`)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        displayFilms(data.Search)
    })
    .catch(err=>{
        document.getElementById('not-found-text').style.display='block'
        document.getElementById('placeholder').style.display='none'
    })
}
function displayFilms(films){
    const filmIds=films.map(f=>f.imdbID)
    const requests=filmIds.map(id=>fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apikey}`))
    Promise.all(requests).then(
        responses=>{
            Promise.all(responses.map(r=>r.json()))
            .then(data=>{
                console.log(data)
                document.getElementById('main')
                .innerHTML=getFilmsHtml(data)
            })
        })
        .catch(err=>{
            console.error(err)
        })
}

function addToWatchList(movieId,target){
    if(localStorage.getItem('watchlist')){
        let previous=JSON.parse(localStorage.getItem('watchlist'))
        
        localStorage.setItem('watchlist',JSON.stringify([...previous,movieId]))
    }else{
        localStorage.setItem('watchlist',JSON.stringify([movieId]))
    }
    target.style.display='none'
}

function isFavorite(filmId){
    if(!localStorage.getItem('watchlist'))return false
    return JSON.parse(localStorage.getItem('watchlist')).some(e=>e==filmId)

}

function getFilmsHtml(films){
    let html=``

    for(let film of films){
        const button=isFavorite(film.imdbID)?'':
        `<button class="btn-action" onClick="addToWatchList('${film.imdbID}',this)">
        <img src="./img/add.png">
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
