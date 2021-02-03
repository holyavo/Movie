/*-----------Information about film-----------------*/

let film = new Vue({
    el: '.film',
    data: {
        currentFilm: '',
        genres: '',
    },
    methods:{
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
    }
})


//Setting current film
film.$data.currentFilm = JSON.parse(sessionStorage.getItem('film'))
console.log(film.$data.currentFilm)


//Setting current genres
let currentFilmGenresIds = film.$data.currentFilm.genre_ids
let genresList = JSON.parse(sessionStorage.getItem('genres'))
let currentFilmGenres = []

for(genre of genresList){
  for(id of currentFilmGenresIds){
    if(genre.id == id){
      currentFilmGenres.push(genre.name)
    }
  }
}
film.$data.genres = currentFilmGenres.slice(',').join(', ')

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

/*-------------Similar films---------------*/


//Downloading list of similar films
async function loadSimilarFilms(){
  let api_1 = `https://api.themoviedb.org/3/movie/${film.$data.currentFilm.id}/recommendations?api_key=199e3266bbea2bf403f8db596f56fc2b&language=ru&page=1`
  let response_1 = await fetch(api_1)
  let data_1 = await response_1.json()

  let api_2 = `https://api.themoviedb.org/3/movie/${film.$data.currentFilm.id}/recommendations?api_key=199e3266bbea2bf403f8db596f56fc2b&language=ru&page=${randomPage(1, 2, data_1)}`
  let response_2 = await fetch(api_2)
  let data_2 = await response_2.json()

  console.log(data_2)

  similarFilm.$data.filmList = shuffleFilms(data_2.results)

 //Deleting selector films_similar if nothing is found
  if(data_2.results.length == 0){
    document.getElementsByClassName('films_similar')[0].style = 'display: none'
    document.getElementsByClassName('container')[0].style = 'height: 100vh'
  }


  addPropertyChosen()

}

loadSimilarFilms()

//Add property 'chosen' function
function addPropertyChosen(){

  let chosenFilms = JSON.parse(sessionStorage.getItem('chosenFilms'),reviver)

  for(let el of similarFilm.$data.filmList){
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

// Shuffleing similar films
function shuffleFilms(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  //returning first six films
  return array.slice(0, 6);
}

// Getting random page
function randomPage(min, max, data) {

  if(data.total_pages == 1){
    return 1
  }
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}


let similarFilm = new Vue({
  el: '.films_similar',
  data:{
    filmList:''
  },
  methods:{
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
    getFilmInfo: function(film){
        console.log(film);
        sessionStorage.setItem('film', JSON.stringify(film))
    }
  }
})

console.log(similarFilm.$data.filmList)
