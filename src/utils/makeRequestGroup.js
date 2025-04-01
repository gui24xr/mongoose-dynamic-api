const makeRequestGroup = ({model,logging = false}) =>{

    const postRequest = async (req, res, next) => {
        try {
            const created = await model.create({ ...req.body })
            return res.status(201).json({ ...created.toObject() })
        } catch (error) {
            if (logging) console.log(error)
            return res.status(500).json({ message: 'Internal server error.' })
        }
    }

    const getByIdRequest = async (req, res, next) => {
        try {
            const founded = await model.findById(req.params.id).lean().exec()
            if (!founded) return res.status(404).json({ message: `Resource with ID ${req.params.id} not found` })
            return res.status(200).json(founded)
        } catch (error) {
            if (logging) console.log(error)
            return res.status(500).json({ message: 'Internal server error.' })
        }
    }

    const getByQueryRequest = async (req, res, next) => {

        try {
      
            const founded = await model.find(req.query).populate().lean().exec()
            return res.status(200).json(founded)
        } catch (error) {
            if (logging) console.log(error)
            return res.status(500).json({ message: 'Internal server error.' })
        }
    }

    const putByIdRequest = async (req, res, next) => {
        try {
           
            const updated = await model.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).exec()
            return res.status(200).json({ ...updated.toObject() })
        } catch (error) {
            if (logging) console.log(error)
            return res.status(500).json({ message: 'Internal server error.' })
        }
    }

    const deleteOneRequest = async (req, res, next) => {
        try {
           const result = await model.deleteOne({_id: req.params.id})
           if (result.deletedCount == 0) return res.status(404).json({ message: `Resource with ID ${req.params.id} not found`});

           return res.status(204).send()
        } catch (error) {
            if (logging) console.log(error)
            return res.status(500).json({ message: 'Internal server error.' })
        }
    }

    const deleteByIdListRequest = async (req, res, next) => {
        try {
            const ids = req.query.ids?.split(",");
            const result = await model.deleteMany({
                _id: { $in: ids }
            })
            if (result.deletedCount < ids.length) throw new Error("One or more resources were not deleted...")
            return res.status(204).send()
        } catch (error) {
            if (logging) console.log(error)
            return res.status(500).json({ message: 'Internal server error.' })
        }
    }

    return {
        postRequest,
        getByIdRequest,
        getByQueryRequest,
        putByIdRequest,
        deleteOneRequest,
        deleteByIdListRequest   
    }
}


export default makeRequestGroup