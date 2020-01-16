const router = require('express').Router();
const services = require('../services/competitionServices');
const functions = require('../function');


//admin
router.post('/addCompetition', async (req, res) => {
    try {
        let payload = req.body;
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 240,
                message: "access token not found",
                data: {}
            })

        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);


        let data = await services.addCompetition(payload);
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//user or admin 
router.get('/getCompetition', async (req, res) => {
    try {
        let params = req.params;
        /* if(!req.headers.authorization)
             {
                 return res.status(200).json({
                     statusCode: 240,
                     message: "access token not found",
                     data: {}
                 })
 
             }
             let token=req.headers.authorization.split(' ')[1];
             console.log(token);
             
             let decodedData = await functions.authenticate(token);
             if (!decodedData) {
                 return res.status(200).json({
                     statusCode: 400,
                     message: "somthing went wrong1",
                     data: {}
                 });
             }
        */
        let data = await services.getCompetition(params);
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//admin
router.put('/updateCompetition', async (req, res) => {
    try {
        let payload = req.body;
        //   let params=req.params;
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 240,
                message: "access token not found",
                data: {}
            })
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);

        let decodedData = await functions.authenticate(token);
        if (!decodedData) {
            return res.status(200).json({
                statusCode: 400,
                message: "Token is not authenticated",
                data: {}
            });
        }
        let data = await services.updateCompetition(payload)
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//admin 
router.delete('/deleteCompetition', async (req, res) => {
    try {
        let payload = req.body;
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 240,
                message: "access token not found",
                data: {}
            })
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);

        let decodedData = await functions.authenticate(token);
        if (!decodedData) {
            return res.status(200).json({
                statusCode: 400,
                message: "Token is not authenticated",
                data: {}
            });
        }
        let data = await services.deleteCompetition(payload)
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//----------//
router.delete('/deleteAllCompetition', async (req, res) => {
    try {
        let payload = req.body;
        let data = await services.deleteAllCompetition(payload)
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//admin
router.post('/changeCompetitionStatus', async (req, res) => {
    try {
        let payload = req.body;
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 240,
                message: "access token not found",
                data: {}
            })

        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);


        let data = await services.changeCompetitionStatus(payload);
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})


//add videos[user]

router.post('/addCompetitionVideos', async (req, res) => {
    try {
        let payload = req.body;
        if(!req.headers.authorization){
            return res.status(200).json({
                statusCode: 400,
                message: "access token not found",
                data: data
            })
        }
        let token=req.headers.authorization.split(' ')[1];
        let data = await services.addCompetitionVideo(payload,token);
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//user
router.get('/getCompetitionVideos', async (req, res) => {
    try {
        
        let data = await services.getCompetitionVideo();

        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data: data
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong",
            data: {}
        })
    }
})

//get user videos
router.get('/getUserCompetitionVideos/:mobileNo', async (req, res) => {
    try {
        let params=req.params;
        if(!req.headers.authorization){
            return res.status(200).json({
                statusCode: 400,
                message: "access token not found",
                data: data
            })
        }
        let token=req.headers.authorization.split(' ')[1];
     
        let data = await services.getUserCompetitionVideo(params,token);

        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//
router.get('/getAllCompetitionVideos', async (req, res) => {
    try {
        if(!req.headers.authorization){
            return res.status(200).json({
                statusCode: 400,
                message: "access token not found",
                data: data
            })
        }
        let token=req.headers.authorization.split(' ')[1];
    
        let data = await services.getAllCompetitionVideo(token);

        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})


//delete videos

router.put('/deleteCompetitionVideos', async (req, res) => {
    try {
        let payload = req.body;
        let data = await services.deleteCompetitionVideos(payload)
        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: {data}
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "Somthing went wrong",
            data: {}
        })
    }
})


//add prize  admin [result state]



//add likes

router.put('/likes', async (req, res) => {
    try {
        let payload = req.body;
        if(!req.headers.authorization){
            return res.status(200).json({
                statusCode: 400,
                message: "access token not found",
                data: data
            })
        }
        let token=req.headers.authorization.split(' ')[1];
        
        let data = await services.addLike(payload,token);

        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})


router.get('/getLike', async (req, res) => {
    try {
        let query=req.query;
        let data = await services.getLike(query);

        return res.status(200).json({
            statusCode: 200,
            message: "Sucess",
            data: {data}
        })
        

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })

    }
});

router.post('/declareCompetitionWinner', async (req, res) => {
    try {
        let payload = req.body;
        let data = await services.declareCompetitionWinner(payload);

        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        console.log(error);
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})

//
router.get('/getDeclareCompetitionWinner', async (req, res) => {
    try {
        let params = req.params;
        let data = await services.getDeclareCompetitionWinner(params);

        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "Failure",
            data: {}
        })
    }
})


//[admin] judging state

router.get('/getSelectedCompetitionVideos', async (req, res) => {
    try {
        let data = await services.getSelectedCompetitionVideo();

        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "Somthing went wrong",
            data: {}
        })
    }
})

module.exports = router;