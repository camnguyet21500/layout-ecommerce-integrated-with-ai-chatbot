const renderCarouselProductVariants = async () => {
  const {
    data: { list: productVariants },
  } = await get('/product-variants?itemPerPage=3&page=1');
  const $carousel = $('#carousel-product-variant');
  productVariants.forEach((variant, index) => {
    const product = variant.product;
    const imageUrl =
      variant.productImages[0]?.imageUrl ?? product.productImages[0]?.imageUrl;

    const $carouselItem = $(`
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="mask flex-center">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-7 col-12 order-md-1 order-2">
              <h4 style="color: black;">
                ${product.name.replace('\n', '<br>')}
              </h4>
              <p style="color: black;">
                ${product.description}
              </p>
              <a href="product.html?productID=${product.id}">BUY NOW</a>
            </div>
            <div class="col-md-5 col-12 order-md-2 order-1">
              <img src="${imageUrl}" class="mx-auto" alt="slide">
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

    $carousel.append($carouselItem);
  });
};

const renderProductsBestSellers = async () => {
  const {
    data: { list: productVariants },
  } = await get('/product-variants?itemPerPage=4&page=1');
  const $products = $('#products-best-sellers');
  productVariants.forEach((variant, index) => {
    const product = variant.product;
    const imageUrl =
      variant.productImages[0]?.imageUrl ?? product.productImages[0]?.imageUrl;
    const price = variant.price ?? product.price;

    const $product = $(`
        <div class="col-sm">
            <div class="product-item" style="width:100%; height:220px; overflow:hidden;">
                <a href="product.html?productID=${product.id}">
                    <img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover;">
                </a>
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <span>${Number(price).toLocaleString('vi-VN')} VNĐ</span>
            </div>
        </div>
  `);

    $products.append($product);
  });
};

(async () => {
  await renderCarouselProductVariants();
  await renderProductsBestSellers();
})();
