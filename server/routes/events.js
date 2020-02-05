/*
Posts Route | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/

const express = require('express');
const router = express.Router();

const {
    getAllEventsByEventId
} = require('../queries/events');

const handleError = (response, err) => {
    if (err.message === "No data returned from the query.") {
        response.status(404)
        response.json({
            status: 'fail',
            message: 'Unexpected route',
            payload: null,
        })
    } else if (err.constraint === 'comments_post_id_fkey') {
        response.status(404)
        response.json({
            status: 'fail',
            message: 'Wrong route',
            payload: null,
        })
    } else { 
        console.log(err)
        response.status(500)
        response.json({
            status: 'fail',
            message: 'Sorry, Something Went Wrong (BE)',
            payload: null,
        })
    }
}

// GET ALL EVENTS BY EVENT ID

router.get('/', async (request, response) => {

        try {
            const allEventsByEventId = await getAllEventsByEventId();
            if (allEventsByEventId.length) {
                response.json({
                    status: 'success',
                    message: `Successfully retrieved all events`,
                    payload: allEventsByEventId,
                })
            } else {
                response.json({
                    status: 'success',
                    message: 'No events returned.',
                    payload: [],
                })
            }
        } catch (err) {
            handleError(response, err)
        }
    }
)


module.exports = router