const opponent = (comp) =>{
  return  {
    move: ()=>{
      const {total, empty,drink} = comp;
      console.log(total-empty);
      switch((total-empty) % 4)
      {
        case 1: drink(1); break;
        case 2: drink(2); break;
        case 3: drink(3); break;
        case 0: drink(Math.floor(Math.random() * (4 - 1) + 1)); break;
      }
    }
  };
};

export default opponent;