pragma solidity ^0.5.0;

contract StorageData {
  string public data;
  uint public id;
  event stored(address _from, string _data, uint _id);

  function set(string memory _data,uint  _id) public {
    emit stored(msg.sender, _data, _id);
    data = _data;
    id = _id;
  }

  function read() public view  returns(string memory, uint) {
    return(data, id);
  }
}
