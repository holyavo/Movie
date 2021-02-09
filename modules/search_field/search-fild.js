let searchButton = document.querySelector('.search-btn')
let searchField = null

searchButton.addEventListener('click', function(){
   searchField = document.querySelector('.search-input_active')
   
   if(searchField){

    searchField.addEventListener('keyup', function(e){
        console.log(e)

        let searchWindow = document.querySelector('.search-window')
        
        if(searchField.value == ''){
            searchWindow.classList.remove('search-window_active')

        }else{
            searchWindow.classList.add('search-window_active')
            loadSearchedFilms(searchField.value)
            
        }

        
    })
   }
})


async function loadSearchedFilms(str){
    let api = `https://api.themoviedb.org/3/search/movie?api_key=199e3266bbea2bf403f8db596f56fc2b&language=ru&query=${str}&page=1&include_adult=false`
    let response = await fetch(api)
    let data = await response.json()

    console.log(data.results)

    let chosenFilms = JSON.parse(sessionStorage.getItem('chosenFilms'),reviver)

    //Checking if film is chosen
    if(chosenFilms != null){
        for(el of data.results.slice(0, 4)){
            if(el.title && chosenFilms.has(el.title) ){
                el.chosen = chosenFilms.get(el.title).chosen
            }else{
                el.chosen = false
            }
        }
    }else{
        for(el of data.results.slice(0, 4)){
               el.chosen = false 
        }
    }

    
    searchedFilm.$data.films = data.results.slice(0, 4)

  
    function reviver(key, value) {
        if(typeof value === 'object' && value !== null) {
          if (value.dataType === 'Map') {
            return new Map(value.value);
          }
        }
        return value;
      }
}



let searchedFilm = new Vue({
    el: '#search-window',
    data:{
        films: ''
    },
    methods:{
        getFilmInfo: function(film){
            console.log(film);
            sessionStorage.setItem('film', JSON.stringify(film))
        }
    }
})


