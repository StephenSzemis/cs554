const {ApolloServer, gql } = require('apollo-server');
const { v4: uuid } = require('uuid');
const axios = require('axios');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');

const url = "http://localhost:4000";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const api_key = '_F3QgHnyc4b4VUMVaStzFZcB-4CT2c-eKzbPabVWb6Q';
const api_root = 'https://api.unsplash.com/photos/?client_id=' + api_key;

const bin_name = "bin";

const typeDefs = gql`
    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type Mutation {
        uploadImage(url: String!, description: String, posterName: String): ImagePost
        updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;

const resolvers = {
    Query: {
        async unsplashImages(parent, args, context, info) {
            let response = await axios.get(api_root);
            if (args.pageNum) {
                response = await axios.get(api_root + '&page=' + args.pageNum);
            }
            // console.log(response.data);
            
            const new_photos = response.data.map(async photo => {
                const binned = await client.sismemberAsync(bin_name, photo.id);
                return {
                    id: photo.id,
                    url: photo.urls.small,
                    posterName: photo.user.username,
                    description: photo.description,
                    userPosted: false,
                    binned: binned
                };
            });
            return new_photos;
        },
        async binnedImages() {
            const ids = await client.smembersAsync(bin_name);
            const images = await Promise.all(ids.map(async (id) => {
                const item = await client.getAsync(id);
                const image = JSON.parse(item);
                if (image.binned) {
                    return image;
                }
            }));
            // console.log(images);
            return images;
        },
        async userPostedImages() {
            // Use Keys command for redis, then JSON our strings and filter for userPosted
            const keys = await client.keysAsync('*');
            const images = keys.map(async (key) => {
                if (key != bin_name) {
                    const item = await client.getAsync(key);
                    const image = JSON.parse(item);
                    if (image.userPosted) {
                        return image;
                    }
                }
            });
            return images;
        }
    },
    Mutation: {
        async uploadImage(parent, args, context, info) {
            let id = uuid();
            let url = args.url;
            let description = "";
            let posterName = "";
            let userPosted = true;
            let binned = false;
            if (args.description) { description = args.description; }
            if (args.posterName) { posterName = args.posterName; }
            const new_post = {
                id: id,
                url: url,
                posterName: posterName,
                description: description,
                userPosted: userPosted,
                binned: binned
            };
            const result = await client.setAsync(id, JSON.stringify(new_post));
            return new_post;
        },
        async updateImage(parent, args, context, info) {
            // console.log(args);
            let id = args.id;
            let url = "";
            let description = "";
            let posterName = "";
            let userPosted = false;
            let binned = false;
            const check = await client.existsAsync(id);
            if (check) {
                const result = await client.getAsync(id);
                const obj = JSON.parse(result);
                url = obj.url;
                description = obj.description;
                posterName = obj.posterName;
                userPosted = obj.userPosted;
                binned = obj.binned;
            }
            if (args.url) { url = args.url; }
            if (args.description) { description = args.description; }
            if (args.posterName) { posterName = args.posterName; }
            if (args.userPosted) { userPosted = args.userPosted; }
            if (args.binned !== null) { binned = args.binned; }
            const new_post = {
                id: id,
                url: url,
                posterName: posterName,
                description: description,
                userPosted: userPosted,
                binned: binned
            };
            // console.log(binned);
            if (binned === true) {
                const result = await client.setAsync(id, JSON.stringify(new_post));
                // Add to bin
                const result2 = await client.saddAsync(bin_name, id);
                // console.log('Adding ' + id + ' to bin');
                return new_post;
            }
            if ((!userPosted) && (!binned)) {
                const result = await client.delAsync(id);
                const result2 = await client.srem(bin_name, id);
                return new_post;
            }
            if (!binned) {
                // console.log('hello?')
                const result = await client.setAsync(id, JSON.stringify(new_post));
                const result2 = await client.srem(bin_name, id);
                return new_post;
            }
            const result = await client.setAsync(id, JSON.stringify(new_post));
            return new_post;
        },
        async deleteImage(parent, args, context, info) {
            const id = args.id;
            if (await client.existsAsync(id)) {
                const result = await client.getAsync(id);
                const result2 = await client.delAsync(id);
                const result3 = await client.srem(bin_name, id);
                return JSON.parse(result);
            } else {
                return null;
            }
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log('Server ready at ' + url);
});