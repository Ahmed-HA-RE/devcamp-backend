// @route              GET /api/v1/bootcamps
// @desc               Get all the bootcamps
// @access             Public
export async function getBootcamps(req, res, next) {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
}

// @route              GET /api/v1/bootcamps/:id
// @desc               Get single bootcamp
// @access             Public
export async function getBootcamp(req, res, next) {
  res.status(200).json({ success: true, msg: `Get Bootcamp ${req.params.id}` });
}

// @route              POST /api/v1/bootcamps
// @desc               Create new bootcamp
// @access             Private
export async function createBootcamp(req, res, next) {
  res.status(200).json({ success: true, msg: 'Create new bootcamp' });
}

// @route              PUT /api/v1/bootcamps
// @desc               Update bootcamp
// @access             Private
export async function updateBootcamp(req, res, next) {
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamp ${req.params.id}` });
}

// @route              DELETE /api/v1/bootcamps
// @desc               Delete bootcamp
// @access             Private
export async function deleteBootcamp(req, res, next) {
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp ${req.params.id}` });
}
