let searchBtn = document.querySelector('.search-btn')
let inputFrame = document.querySelector('.search input')
let header = document.querySelector('.header')



let searchSvg = './img/search_img.svg'
let crossSvg = './img/cross.svg'



// To show/hidden input frame
searchBtn.addEventListener('click', function(){

    inputFrame.classList.toggle('search-input_active')

    //Change button icon
    if( this.firstElementChild.src === searchSvg){
        this.firstElementChild.src = crossSvg
    }else{
        this.firstElementChild.src = searchSvg

        let search_Window = document.querySelector('.search-window')
        search_Window.classList.remove('search-window_active')
        inputFrame.value = ''

    }
  
})

// To hidden/show header
window.addEventListener('scroll', function(){
    if(window.scrollY >= 50){
        header.classList.add('header_visiable')
        inputFrame.classList.remove('search-input_active')
        searchBtn.firstElementChild.src = searchSvg
        
        let search_Window = document.querySelector('.search-window')
        search_Window.classList.remove('search-window_active')
        inputFrame.value = ''
    }else{
        header.classList.remove('header_visiable')
    }
})

//Downloading list of genres
async function loadGenres(){
    let api = 'https://api.themoviedb.org/3/genre/movie/list?api_key=199e3266bbea2bf403f8db596f56fc2b&language=ru-Ru'
    let response = await fetch(api)
    let data = await response.json()

    sessionStorage.setItem('genres', JSON.stringify(data.genres))
}

loadGenres()


// Downloading popular films from API
let posterPath = 'https://image.tmdb.org/t/p/original'
let filmPoster = document.querySelector('.card img')
let page = 1
let films = []

function loadingFilms(){
    let page = 1

    return async function (){
        let api = `https://api.themoviedb.org/3/movie/popular?api_key=199e3266bbea2bf403f8db596f56fc2b&language=ru-RU&page=${page}&`
    
        let response = await fetch(api)
        let data = await response.json()
        
        addPropertyChosen(data.results)
    
        films = films.concat(data.results)
    
        filmPoster.src = posterPath + films[4].poster_path
    
        card.$data.filmList = films

        page++
    }
}

let loadFilms = loadingFilms()
loadFilms()

//Add property 'chosen' function
function addPropertyChosen(films){

    let chosenFilms = JSON.parse(sessionStorage.getItem('chosenFilms'),reviver)

    for(let el of films){
        //checking if current film is already in chosen collection and assign to prop 'chosen' value 'true'
        if(chosenFilms && chosenFilms.has(el.title)){
            el.chosen = chosenFilms.get(el.title).chosen
        }else{
            el.chosen = false
        }
        
    }

    function reviver(key, value) {
        if(typeof value === 'object' && value !== null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }
        return value;
      }
}

//Add/delete chosen film in collection and in session storage
function toProcessFilmInChosenCollection(film){
    //Check if session variable is exist
    if(!sessionStorage.getItem('chosenFilms')){
        sessionStorage.setItem('chosenFilms', JSON.stringify(new Map(), replacer ))
    }

    let chosenFilms = JSON.parse(sessionStorage.getItem('chosenFilms'),reviver)
    
    if(!chosenFilms.has(film.title)){
        chosenFilms.set(film.title, film)
    }else{
        chosenFilms.delete(film.title)
    }

    console.log(chosenFilms)
    saveInSessionStorage(chosenFilms)

    function saveInSessionStorage(filmsCollection){
        sessionStorage.setItem('chosenFilms', JSON.stringify(filmsCollection, replacer))
    }
    
    function replacer(key, value) {
        const originalObject = this[key];
        if(originalObject instanceof Map) {
          return {
            dataType: 'Map',
            value: Array.from(originalObject.entries()), // or with spread: value: [...originalObject]
          };
        } else {
          return value;
        }
      }
    
      function reviver(key, value) {
        if(typeof value === 'object' && value !== null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }
        return value;
      }
}

// Creating cards Vue
let card = new Vue({
    el: '#popular-films',
    data: {
        filmList: '',
    },
    methods: {
        toChoseFilm: function(film, el){
            // Getting polygon element
            let fill = el.path[0]
            
            if(film.chosen === false ){
                //Adding film in chosen and make star yellow
                film.chosen = true
                fill.setAttribute('fill', 'yellow')
                //Add film lo chosen collection
                toProcessFilmInChosenCollection(film)
            }else{
                //Deleting film from chosen and make star white
                film.chosen = false
                fill.setAttribute('fill', 'white')
                //Delete from chosen collection
                toProcessFilmInChosenCollection(film)
            }
                console.log(film)
        },
        handleScroll: function(){
            let bodyHeight = document.body.scrollHeight
            let currentPosition = window.scrollY + window.innerHeight
            
            // Dynamic films loading
            if(currentPosition  >= bodyHeight){
                loadFilms()
            }

        }, 
        getFilmInfo: function(film, ev){
            console.log(ev);
            sessionStorage.setItem('film', JSON.stringify(film))

            

        }
    },
    created(){
        window.addEventListener('scroll', this.handleScroll)
        
    }
})

/*
window.addEventListener('scroll', function(){
    console.log(window.scrollY)
    console.log(document.getElementsByClassName('container')[0].scrollHeight)


    document.getElementsByClassName('container')[0].style = `height: ${document.getElementsByClassName('container')[0].scrollHeight}px`
})

window.onload = function () {
    window.scrollBy(0, +sessionStorage.getItem('page_scroll'));
 }*/
 //sessionStorage.setItem('page_scroll', ev.pageY)