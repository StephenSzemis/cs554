const axios = require('axios');

module.exports = {

    getShows: async () => {
        try {
            const response = await axios.get('http://api.tvmaze.com/shows');
            return response.data;
        } catch(error) {
            //console.log("Error in getShows");
            return error;
        }
    },

    getShow: async (id) => {
        try {
            const response = await axios.get('http://api.tvmaze.com/shows/' + id);
            return response.data;
        } catch(error) {
            //console.log("Error in getShow");
            return error;
        }
    },

    search: async (term) => {
        try {
            const response = await axios.get('http://api.tvmaze.com/search/shows?q=' + term);
            return response.data;
        } catch(error) {
            //console.log("Error in search");
            return error;
        }
    }


};

