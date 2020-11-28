const graphql = require('graphql')
const User = require('../model/User')
const Image = require('../model/Image')

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, } = graphql

const ImageType = new GraphQLObjectType({
    name: "ImageType",
    fields: () => ({
        id: { type: GraphQLID },
        userid: { type: GraphQLID },
        image: { type: GraphQLString },
         likes: {
             type: new GraphQLList(LikeType),
             async resolve(parent, args) {
                try {
                    const data = await Image.findById(parent.id)
                    return data.likes.map(item => item)
                }
                catch(err) {
                    console.log(err)
                }
                
            }
        } ,
        createdAt: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userid)
            }
        }
    })
})
const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        profileImage: { type: GraphQLString }
    })
})
const LikeType = new GraphQLObjectType({
    name: "LikeType",
    fields: () => ({
        id: { type: GraphQLID },
        userid: { type: GraphQLID }
    })
})
const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: {
        images: {
            type: new GraphQLList(ImageType),
            resolve(parent,args) {
                return Image.find({})
            }
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },
        specificUserImage: {
            type: new GraphQLList(ImageType),
            args: {
                userid: { type: GraphQLID }
            },
            async resolve(parent, args) {
                const { userid } = args
                try  {
                    return Image.find({userid})
                }
                catch(err) {
                    console.log(err)
                }
            }
        },
        specificImage: {
            type: ImageType,
            args: { id: { type: GraphQLID }},
            async resolve(parent, args) {
                const { id } =  args
                try {
                    const image = Image.findById(id)
                    return image
                }
                catch(err) {
                    console.log(err)
                }
            }
        },
        
    }
}) 
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        user: {
            type: UserType,
            args:{
                email: { type: GraphQLString },
                name: { type: GraphQLString },
                profileImage: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const { email, name, profileImage } = args
                try {
                    const user = await User.findOne({email})
                    if(user) {
                        console.log('existing User')
                        return user
                    }
                    else {
                    const userInfo = await User.create({ email, name, profileImage })
                    return userInfo
                    }
                }
                catch(err) {
                        console.log(err)
                }
            }
        },
        image: {
            type: ImageType,
            args: { 
                userid: { type: GraphQLID },
                image: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const { userid, image } = args
                try {
                    const userImage = await Image.create({ userid, image })
                    return userImage
                }
                catch(err) {
                    console.log(err)
                }
            }
        },
        likeImage: {
            type: ImageType,
            args: {
                imageid: { type: GraphQLID },
                userid: { type: GraphQLID },
            },
            async resolve(parent, args) {
                const { imageid, userid } = args
                try {
                   const data = await Image.findById(imageid)
                   if(data) {
                       const conLike = data.likes.find(like => {
                           if(like.userid === userid ) {
                           return true
                           }
                           else {
                                return false
                           }
                       })
                       if(conLike === undefined) {
                        Image.updateOne({_id: imageid}, { $push: { likes: {userid} } })
                        .then(() => console.log("Updated Added User"))
                        .catch(err => console.log(err))
                       }
                       else {
                    Image.updateOne({_id: imageid}, { $pull: { likes: {userid} }})
                    .then(() => console.log('Deleted Array Nested'))
                    .catch(err => console.log(err))
                       }
                   }
                }
                catch(err) {
                    console.log(err)
                }
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
// Image.updateOne({_id: imageid}, { $pull: { likes: {userid} }})
// .then(() => console.log('Deleted Array Nested'))
// .catch(err => console.log(err))

// Image.updateOne({_id: imageid}, { $push: { likes: {userid} } })
// .then(() => console.log("Updated Added User"))
// .catch(err => console.log(err))