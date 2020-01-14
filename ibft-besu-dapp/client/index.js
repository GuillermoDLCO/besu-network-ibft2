import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    //Provider de metamask
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    // Para ganache
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {
	const $create = document.getElementById('create');
	const $createResult = document.getElementById('create-result');
	const $read = document.getElementById('read');
	const $readResult = document.getElementById('read-result');
	const $edit = document.getElementById('edit');
	const $editResult = document.getElementById('edit-result');
	const $delete = document.getElementById('delete');
	const $deleteResult = document.getElementById('delete-result');
	let accounts = [];
	
	web3.eth.getAccounts()
	 .then(_accounts => {
		accounts = _accounts;
	 });
	$create.addEventListener('submit', e => {
	  e.preventDefault();
	  const name = e.target.elements[0].value;
	  crud.methods
	   .create(name)
	   .send({from: accounts[0]})
	   .then(() => {
	     $createResult.innerHTML = `Nuevo usuario ${name} fue creado satisfactoriamente!`;
	     })
	   .catch(() => {
	     $createResult.innerHTML = 'Ocurrio un error mientras se creaba un nuevo usuario ...'
	   });
	});
	
	$read.addEventListener('submit', e => {
		e.preventDefault();
		const id = e.target.elements[0].value;
		crud.methods
			.read(id)
			.call()
			.then(result => {
				$readResult.innerHTML = `Id: ${result[0]} Name: ${result[1]}`;
			})
			.catch(() => {
				$readResult.innerHTML = `Hubo un problema mientras se intentaba leer el usuario ${id}`;
			});
	});
	
	$edit.addEventListener('submit', e => {
		e.preventDefault();
		const id = e.target.elements[0].value;
		const name = e.target.elements[1].value;
		crud.methods
		 .update(id, name)
		 .send({from: accounts[0]})
		 .then(() => {
			 $editResult.innerHTML = `Se cambio el nombre del usuario ${id} a ${name}`;
		 })
		 .catch(() => {
			 $editResult.innerHTML = `Hubo un problema mientras se intentaba actualizar el usuario ${id}`;
		 });
	});

	$delete.addEventListener('submit', e => {
		e.preventDefault();
		const id = e.target.elements[0].value;
		crud.methods
			.destroy(id)
			.send({from: accounts[0]})
			.then(() => {
				$deleteResult.innerHTML = `Usuario ${id} eliminado`;
			})
			.catch(() => {
				$deletedResult.innerHTML = `Hubo un problema mientras se intentaba eliminar el usuario ${id}`;
				});
	});
};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
