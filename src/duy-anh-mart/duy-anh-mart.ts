import {
  autoinject,
  BindingEngine,
  computedFrom,
  observable,
} from "aurelia-framework";

import { ProductDatabase } from "./ProductDatabase";
import {
  Product,
  EMPTY_PRODUCT,
  TEST_PRODUCT,
  SessionProduct,
} from "./ProductEntity";

import "./duy-anh-mart.scss";

/**
 * Quickly add new products
 */
const QUICK_MODE = false;

@autoinject()
export class DuyAnhMart {
  private readonly sessionProduct: SessionProduct;
  private readonly shouldAutoAddThousand = true;
  private readonly helpContentRef: HTMLElement;
  private readonly helpLabelRef: HTMLElement;
  private readonly newProductPriceInputRef: HTMLInputElement;
  private readonly newProductNameInputRef: HTMLInputElement;
  private readonly updateProductPriceRef: HTMLInputElement;
  private readonly updateProductNameRef: HTMLInputElement;
  private readonly productCodeInputRef: HTMLInputElement;
  private readonly amountForProductRef: HTMLInputElement;

  private newProductName: string;
  private newProductPrice: number;
  private updatedProductName: string;
  private updatedProductPrice: number;
  private sessionCollection: SessionProduct[] = [];
  private amountForProduct: number;
  private showHelpContent = false;
  private quickMode = QUICK_MODE;

  // currentProduct: Product = TEST_PRODUCT;
  currentProduct: Product;
  /** The one just scanned before auto-reset */
  previousProductCode = "";
  sessionSum: number;

  @observable()
  productCode = "";
  @observable()
  newlyAddedProduct: Product;
  @observable()
  showUpdatedMessage = false;

  @computedFrom("currentProduct.price")
  get canEditPrice() {
    const priceFound = this.currentProduct?.price !== undefined;
    return priceFound;
  }

  @computedFrom("currentProduct.price")
  get priceNotFound() {
    const productCodeExists = this.productCode !== "";
    const noPriceFound = !this.currentProduct?.price;
    const notFound = productCodeExists && noPriceFound;
    return notFound;
  }

  handleAmountForProductChanged() {
    const current = this.sessionCollection.find(
      (item) => item.code === this.previousProductCode
    );
    // const current = this.getCurrentSessionItem();
    if (current === undefined) return;

    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 72 ~ this.amountForProduct', this.amountForProduct);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 71 ~ current.count', current.count);
    current.count = Number(this.amountForProduct);
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 73 ~ current.count', current.count);
  }

  constructor(
    private readonly bindingEngine: BindingEngine,
    private readonly productDatabase: ProductDatabase
  ) {
    this.productDatabase.init();

    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === "c") {
        console.clear();
      }
      if (ev.key === "t") {
        console.log(this);
      }
    });
  }

  attached() {
    this.addListeners();
    this.addKeyListeners();
    outsideListener(this.helpContentRef, [this.helpLabelRef], () => {
      this.showHelpContent = false;
    });
  }

  private addListeners() {
    this.bindingEngine
      .collectionObserver(this.sessionCollection)
      .subscribe((changes) => {
        /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 93 ~ changes', changes);
      });
  }

  private addKeyListeners(): void {
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        this.clearSession();
      }
    });

    this.productCodeInputRef.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        this.handleProductCodeChanged();
      }
    });

    // this.amountForProductRef.addEventListener("keydown", (ev) => {
    //   if (ev.key === "Enter") {
    //     this.handleAmountForProductChanged();
    //   }
    // });

    this.newProductPriceInputRef.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        this.addNewProduct();
      }
    });

    this.updateProductNameRef.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        this.updateProduct();
      }
    });
    this.updateProductPriceRef.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        this.updateProduct();
      }
    });
  }

  private handleProductCodeChanged(shouldAddToCollection = true) {
    // if (this.productCode === '') {
    //   this.currentProduct = EMPTY_PRODUCT;
    //   return;
    // }

    const product = this.productDatabase.getProduct(this.productCode);

    if (product?.price != null) {
      // Set product
      this.previousProductCode = this.productCode;
      this.currentProduct = product;
      this.updatedProductPrice = this.currentProduct.price;
      this.updatedProductName = this.currentProduct.name;

      if (shouldAddToCollection) {
        this.addToSessionCollection(product);
        this.calculateSessionSum();
      }

      // Clear code input, in order to scan new products
      this.productCode = "";
    } else {
      // this.priceNotFound = true;
      this.clearCurrentProduct();
      this.prepareToAddNewProduct();
    }
  }

  addToSessionCollection(product: Product) {
    const itemAlreadyInSession = this.getCurrentSessionItem();

    if (itemAlreadyInSession !== undefined) {
      itemAlreadyInSession.count = Number(itemAlreadyInSession.count) + 1;
      this.amountForProduct = itemAlreadyInSession.count;
    } else {
      this.sessionCollection.push({
        ...product,
        code: this.productCode,
        time: new Date().toLocaleTimeString(),
        count: 1,
      });
    }
  }

  private getCurrentSessionItem() {
    const found = this.sessionCollection.find(
      (item) => item.code === this.productCode
    );
    return found;
  }

  newlyAddedProductChanged() {
    window.setTimeout(() => {
      this.newlyAddedProduct = undefined;
    }, 7000);
  }

  showUpdatedMessageChanged() {
    window.setTimeout(() => {
      this.showUpdatedMessage = false;
    }, 7000);
  }

  private prepareToAddNewProduct() {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 214 ~ this.quickMode', this.quickMode)

    if (this.quickMode) {
      console.log("hereree");
      window.setTimeout(() => {
        this.productCodeInputRef.blur();
        // this.newProductPriceInputRef.focus();
        this.newProductNameInputRef.focus();
      }, 100);
    }
  }

  addNewProduct() {
    let finalNewPrice = this.newProductPrice;
    if (this.shouldAutoAddThousand) {
      finalNewPrice = finalNewPrice * 1000;
    }

    const newProduct = {
      name: this.newProductName,
      price: finalNewPrice,
    };
    this.newlyAddedProduct = newProduct;

    this.productDatabase.addProduct(this.productCode, newProduct);

    this.clearNewProductValues();
    this.focusProductCodeInput();
  }

  private focusProductCodeInput() {
    this.productCodeInputRef.focus();
    this.productCodeInputRef.value = "";
  }

  private updateProduct(): void {
    const finalUpdated: Product = {
      ...this.currentProduct,
      price: Number(this.updatedProductPrice),
      name: this.updatedProductName,
    };

    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 158 ~ finalUpdated', finalUpdated);
    this.productDatabase.updateProduct(this.previousProductCode, finalUpdated);

    this.updateSessionCollection(finalUpdated);
    this.calculateSessionSum();

    this.currentProduct = finalUpdated;
    this.showUpdatedMessage = true;
  }

  private updateSessionCollection(finalUpdated: Product) {
    const foundIndex = this.sessionCollection.findIndex(
      (item) => item.code === this.previousProductCode
    );
    this.sessionCollection[foundIndex] = {
      ...this.sessionCollection[foundIndex],
      ...finalUpdated,
    };

    this.sessionCollection = cloneDeep(this.sessionCollection);
  }

  private deleteProduct(): void {
    this.productDatabase.deleteProduct(this.previousProductCode);
  }

  private clearCurrentProduct() {
    // @ts-ignore
    this.currentProduct = {};
    // this.currentProduct = undefined;
    this.updatedProductPrice = undefined;
  }

  private clearSession(): void {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: duy-anh-mart.ts ~ line 140 ~ clearSession');
    this.amountForProduct = NaN;

    this.sessionCollection = [];
    this.clearCurrentProduct();

    this.newProductName = this.productCode = "";
    this.productCodeInputRef.value = "";
    this.productCodeInputRef.focus();
    this.sessionSum = undefined;
    this.showHelpContent = false;

    this.clearNewProductValues();
  }

  private clearNewProductValues() {
    this.newProductPrice = NaN;
    this.newProductName = undefined;
  }

  private calculateSessionSum() {
    const sum = this.sessionCollection.reduce((acc, product) => {
      acc += product.price * product.count;
      return acc;
    }, 0);
    this.sessionSum = sum;
  }

  private setCurrentProduct(selectedSessionProduct: SessionProduct) {
    this.productCode = selectedSessionProduct.code;
    this.handleProductCodeChanged(false);
  }

  private toggleHelp() {
    this.showHelpContent = !this.showHelpContent;
  }

  private downloadDatabase(): void {
    function getRandomId() {
      /**
       * "0.g6ck5nyod4".substring(2, 9)
       * -> g6ck5ny
       */
      return Math.random().toString(36).substring(2, 9);
    }

    function download(content: string, fileName: string) {
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      element.setAttribute("download", `${fileName}.json`);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    const stringify = JSON.stringify(this.productDatabase.database, null, 4);
    /* prettier-ignore */ console.log(">>>> _ >>>> ~ file: launch.ts ~ line 277 ~ stringify", stringify);
    const fileName = "toan-bo-gia";
    download(stringify, fileName);
  }

  uploadedDatabaseJson;
  private async dev_uploadDatabaseJson() {
    const databaseData = await this.uploadedDatabaseJson[0].text();
    const databaseJson = JSON.parse(databaseData);
    this.productDatabase.updateWholeDatabase(databaseJson);
  }
}

function cloneDeep<T>(obj: T): T {
  return structuredClone
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj));
}

function outsideListener(
  elementToObserve: HTMLElement,
  ignoreElements: HTMLElement[],
  onOutsideClick: () => void
) {
  document.addEventListener("click", (evt) => {
    let targetEl = evt.target; // clicked element
    do {
      // @ts-ignore
      if (ignoreElements.includes(targetEl)) {
        return;
      }
      if (targetEl == elementToObserve) {
        return;
      }
      // Go up the DOM
      // @ts-ignore
      targetEl = targetEl.parentNode;
    } while (targetEl);
    // This is a click outside.
    onOutsideClick();
  });
}

/**
 * Features:
 * - search by product name
 * - filters?
 * - history
 * - some kind of versioning
 *
 * Improvements:
 *  - [ ] ability to put amount
 *  - [x] disable tabbing when input disabled
 *  - [ ] also be able to input return amount
 */
