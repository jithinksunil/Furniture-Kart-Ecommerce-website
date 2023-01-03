// display, search, pagination, sort, filter
const product = async (req, res) => {
    try {
      // sort
      let sort;
  
      if (req.query.sort == "asor") {
        sort = { price: -1 };
      } else if (req.query.sort == "dsort") {
        sort = { price: 1 };
      } else {
        sort = {};
      }
      // get data from categorylist
      let category = await categorylist.find({});
  
      // filter
      let filter;
  
      if (req.query.category) {
        filter = { category: req.query.category };
      } else {
        filter = {};
      }
      // search
      let search = "";
      if (req.query.search) {
        search = req.query.search;
      }
      // pagnation
      let page = 1;
      if (req.query.page) {
        page = req.query.page;
      }
      const limit = 6;
      let productdata = await Product.find({
        $or: [
          { name: { $regex: "." + search + ".", $options: "i" } },
          { category: { $regex: "." + search + ".", $options: "i" } },
        ],
      })
     
    
      //.filter(filter)
        .find(filter)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      // count how namy data is sent for paging
      let count = await Product.find({
        $or: [
          { name: { $regex: "." + search + ".", $options: "i" } },
          { category: { $regex: "." + search + ".", $options: "i" } },
        ],
      }).countDocuments();
      
      res.render("../views/product/product", {
        productdata: productdata,
        totalpage: Math.ceil(count / limit),
        currentpage: page,
        categorylist: category,