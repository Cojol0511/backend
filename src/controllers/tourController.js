import pool from "../db/pool.js";

// Function query list of current tour and response result
const getListToursAfterNow = (request, response) => {
  pool.query(
    "SELECT t.tour_id, tour_name, image, SUM(number_day) as number_day, SUM(number_night) as number_night, tour_cost, round(total_vote*1.0/number_vote, 1) as rate FROM tour t, tour_detail td, (SELECT t.tour_id, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and place_order = 1) a WHERE t.tour_id = td.tour_id and a.tour_id = t.tour_id and time_start > NOW() GROUP BY t.tour_id, image;",
    [],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Function query tour by ID and response result
const getTourByID = (request, response) => {
  const { tour_id } = request.body;
  console.log("Tour id ", tour_id);
  pool.query(
    "SELECT t.tour_id, tour_name, description, time_start, SUM(number_day) AS number_day, SUM(number_night) AS number_night, departure_location, vehicle, tour_cost, number_vote, total_vote, note FROM tour t, tour_detail td WHERE t.tour_id = td.tour_id and t.tour_id = $1 GROUP BY t.tour_id;",
    [tour_id],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Function response tour detail information and response result
const getTourDetail = (req, res) => {
  const { tour_id } = req.body;

  pool.query(
    "SELECT ta.tourist_attraction_id, ta.tourist_attraction_name, ta.description, number_day, number_night, schedule_detail, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and t.tour_id=$1 ORDER BY(td.place_order) ASC",
    [tour_id],
    (error, results) => {
      console.log("day la tour id ", tour_id);
      if (error) {
        console.log("error : ", error);
        res.status(500).send(`Error : ${error}`);
      } else if (results === null) {
        console.log("null");
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
};

const bookTour = (req, res) => {
  const { user_id, tour_id } = req.body;
  pool.query(
    "INSERT INTO booked_tour(user_id, tour_id, amount, status) SELECT $1, $2, 1, 'booked' WHERE NOT EXISTS (SELECT 1 FROM booked_tour WHERE user_id=$1 and tour_id = $2)",
    [user_id, tour_id],
    (error, results) => {
      if (error) {
        console.log("error : ", error);
        res.status(500).send(`Error happen. Please try again!!!`);
      } else {
        console.log();
        if (results.rowCount === 0) {
          res.status(200).json("You have already booked this tour!!!");
        } else {
          res
            .status(200)
            .json("Book tour success. Check your shopping cart to see it.");
        }
      }
    }
  );
};

export { getTourByID, getTourDetail, getListToursAfterNow, bookTour };
