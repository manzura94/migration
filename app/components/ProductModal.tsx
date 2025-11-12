
'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BackendProduct, MenuProduct, MergedProduct } from '../types/product.inteface';




interface ProductModalProps {
    open: boolean;
  setOpen: (open: boolean) => void;
selectedProduct: number | null
};

const BASE_URL = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";


export default function ProductModal({open,  setOpen, selectedProduct }: ProductModalProps) {
  const [data, setData] = useState<MergedProduct | null>(null);
  const [activeSize, setActiveSize]=useState('s');
  const [selectedAdditives, setSelectedAdditives] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const handleCloseModal =()=>{
    setOpen(false);
    setData(null)
  }


  const handleSizeButtonClick = (item: string)=>{
    setActiveSize(item);
    setSelectedAdditives([])
  }

  const handleAdditiveButtonClick = (name: string)=>{
    setSelectedAdditives(prev => 
    prev.includes(name)
      ? prev.filter(item => item !== name)   
      : [...prev, name]                      
  )
  };

  const totalPrice = (()=>{
    if(!data) return 0;
   const basePrice = parseFloat(data.sizes[activeSize].price);
   const additivesPrice = selectedAdditives.reduce((sum, additiveName) => {
    const additive = data.additives.find(a => a.name === additiveName);
    return additive ? sum + parseFloat(additive.price) : sum;
  }, 0);

  return basePrice + additivesPrice;

  })()

  

  useEffect(() => {
    if (!open || !selectedProduct) return;

   async function getProductById(id: number){
  try {
    const [backendRes, menuRes] = await Promise.all([
      fetch(`${BASE_URL}/products/${id}`),
      fetch("/data/menu.json"),
    ]);

    if (!backendRes.ok || !menuRes.ok) {
      setError(true);
    }

    const backendJson = await backendRes.json();
    const backendData: BackendProduct = backendJson.data;
    const menuData: MenuProduct[] = await menuRes.json();

    const menuProduct = menuData.find((item) => item.id === backendData.id);

    const mergedProduct: MergedProduct = {
      ...backendData,
      imageUrl: menuProduct?.image ?? null,
    };

    setData( mergedProduct);
    setError(false)
  } catch (error) {
    console.log(error)
    setError(true)
  }
}
getProductById(selectedProduct);
}, [open, selectedProduct]);
console.log(data)

  if (!open) return null;
  return (
    
    <div className='modal-overlay' onClick={() => setOpen(false)} >
          <div  className='modal' onClick={(e) => e.stopPropagation()}>
           {error? <div className="modal__wrapper">
             <p className='modal__error'>Oops! Something went wrong.</p>
                <div className="modal__wrapper__closebtn" onClick={handleCloseModal}>
                    <Image alt='close-button' width={50} height={50} src={'/images/icons/button-close.svg'} className='closebtn-image'/>
                </div>
           </div> : data ? <div className="modal__wrapper">
                <div className="modal__image">
                    <div className="modal__image-wrap">
                        <Image alt='product-image'  src={`${data?.imageUrl ?? '/images/tea-2.jpg'}`} className='modal-image' width={400} height={400}/>
                    </div>
                </div>
                <div className="modal__info">
                    <div className="modal__textwrap">
                        <h4 className="modal__title">{data?.name}</h4>
                        <p className="modal__text">{data?.description}</p>
                         <div className="modal__buttonwrap">
                            <p className="modal__subtitle">Sizes</p>
                            <div className="menu__buttons">{Object.entries(data.sizes).map(([key, button])=>(
                                <button key={key} className={`menu-button size-button ${activeSize === key ? 'active' : ''}`} onClick={()=>handleSizeButtonClick(key)}>
                                    <span className="menu__buttons-icon">{key}</span>
                                    <span className="menu__buttons-text">{button.size}</span>
                                </button>
                            ))}</div>
                         </div>
                         <div className="modal__buttonwrap">
                            <p className="modal__subtitle">Additives</p>
                            <div className="menu__buttons">{Object.values(data.additives).map((button, index)=>(
                                <button key={button.name} className={`menu-button additives ${selectedAdditives.includes(button.name) ? 'active' : ''}`} onClick={()=>handleAdditiveButtonClick(button.name)}>
                                     <span className="menu__buttons-icon">{index+1}</span>
                                    <span className="menu__buttons-text">{button.name}</span>
                                </button>
                            ))}</div>
                         </div>
                         <div className="modal__price">
                            <h4 className="modal__price-title">Total:</h4>
                            <h4 className="modal__price-num">
                                 <span className="modal__price-sign">$</span>
                            <span className='modal__price-price'>{totalPrice.toFixed(2)}</span>
                            <span className='modal__price-old'></span>
                            <span className='modal__price-discount'></span>
                            </h4>
                           
                         </div>
                    </div>
                    <button className="modal__closebtn">Add to cart</button>
                </div>
                <div className="modal__wrapper__closebtn" onClick={handleCloseModal}>
                    <Image alt='close-button' width={50} height={50} src={'/images/icons/button-close.svg'} className='closebtn-image'/>
                </div>
            </div> : <div className="loader">Loading...</div>}
          </div>
        </div>
  );
}
