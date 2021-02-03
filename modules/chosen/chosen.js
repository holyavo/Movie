let film = new Vue({
    el: '.container',
    data: {
        filmList: [],
    },
    methods:{
        getFilmInfo: function(film){
            console.log(film);
            sessionStorage.setItem('film', JSON.stringify(film))
        }
    }
})
for(el of JSON.parse(sessionStorage.getItem('chosenFilms'), reviver).values()){
    film.$data.filmList.push(el)
}


function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

console.log(film.$data.filmList)
