# Erc20 - second trial
1.루트디렉토리 설정
2.환경변수 설정 
3. 스마트 컨트랙트 작성 
4. 컨트랙트 컴파일 및 ABI작성 
5. web3.js 상호작용 코드작성 

in regard to 3번, 5번 

3번 - 스마트 컨트랙트 작성 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("Bart", "BRT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
        
    }
}

5번 - 상호작용 코드작성 
import { Web3 } from 'web3';
import { address as contractAddress, abi as myTokenAbi } from '../abis/Mytoken.json'; // 주소와 ABI를 외부 파일에서 가져옴
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const web3 = new Web3('http://127.0.0.1:7545'); // 가나슈 사용
const privateKey = process.env.PRIVATE_KEY || ''; // .env 파일에서 프라이빗 키 가져오기

export const getChainId = async () => {
  // 체인 ID를 반환합니다.
  return web3.eth.net.getId();
};

export const getWeb3 = async () => {
  // Web3 인스턴스를 반환합니다.
  return web3;
};

export const getOwner = async () => {
  // 컨트랙트 소유자의 계정을 반환합니다.
  return web3.eth.accounts.privateKeyToAccount(privateKey);
};

export const getContract = () => {
  // MyToken Contract 인스턴스를 리턴합니다. - new web3.eth.Contract(ABI, 컨트랙트 주소);
  // 이 후에 구현하는 컨트랙트 호출은 구현한 getContract를 사용합니다.
  const contract = new web3.eth.Contract(myTokenAbi, contractAddress);
  console.log('컨트랙트 주소:', contractAddress); // 디버깅용
  return contract;
};

export const totalSupply = async (): Promise<bigint> => {
  // MyToken의 totalSupply 리턴 값을 리턴합니다.
  const contract = getContract();
  try {
    const result = await contract.methods.totalSupply().call();
    if (result === null || result === undefined) {
      throw new Error('totalSupply가 null 또는 undefined를 반환했습니다.');
    }
    const safeResult = typeof result === 'string' || typeof result === 'number' ? result : String(result);
    console.log('총 공급량 결과:', safeResult); // 디버깅용
    return BigInt(safeResult);
  } catch (error) {
    console.error('totalSupply 호출 실패:', error);
    throw error;
  }
};

export const balanceOf = async (address: string): Promise<bigint> => {
  // 인자 address의 balanceOf 리턴 값을 리턴합니다.
  const contract = getContract();
  try {
    const result = await contract.methods.balanceOf(address).call();
    if (result === null || result === undefined) {
      throw new Error('balanceOf가 null 또는 undefined를 반환했습니다.');
    }
    const safeResult = typeof result === 'string' || typeof result === 'number' ? result : String(result);
    console.log('잔액 결과:', safeResult, '주소:', address); // 디버깅용
    return BigInt(safeResult);
  } catch (error) {
    console.error('balanceOf 호출 실패:', error);
    throw error;
  }
};

export const transfer = async (from: string, to: string, amount: number) => {
  // transfer함수는 컨트랙트의 transfer 함수를 사용해서 from 주소에서 to 주소로 amount(wei 단위)의 토큰을 전송해야 하며, 그 값을 리턴해야 합니다.
  const contract = getContract();
  try {
    const tx = await contract.methods.transfer(to, amount).send({
      from,
      gas: '1000000',
    });
    console.log('전송 트랜잭션:', tx.transactionHash); // 디버깅용
    return tx;
  } catch (error) {
    console.error('transfer 호출 실패:', error);
    throw error;
  }
};

export const approve = async (spender: string, amount: number) => {
  // approve함수는 컨트랙트의 approve 함수를 호출하여 호출하는 주소에서 spender 주소로 amount(wei 단위)만큼 토큰의 권한을 승인해야 하며, 그을 리턴해야 합니다.
  const contract = getContract();
  const account = await getOwner();
  try {
    const tx = await contract.methods.approve(spender, amount).send({
      from: account.address,
      gas: '1000000',
    });
    console.log('승인 트랜잭션:', tx.transactionHash); // 디버깅용
    return tx;
  } catch (error) {
    console.error('approve 호출 실패:', error);
    throw error;
  }
};

export const allowance = async (owner: string, spender: string): Promise<bigint> => {
  // allowance함수는 컨트랙트의 allowance 함수를 사용하여 owner가 spender에게 부여한 토큰의 양을 리턴해야 합니다.
  const contract = getContract();
  try {
    const result = await contract.methods.allowance(owner, spender).call();
    if (result === null || result === undefined) {
      throw new Error('allowance가 null 또는 undefined를 반환했습니다.');
    }
    const safeResult = typeof result === 'string' || typeof result === 'number' ? result : String(result);
    console.log('승인된 양 결과:', safeResult, '소유자:', owner, 'spender:', spender); // 디버깅용
    return BigInt(safeResult);
  } catch (error) {
    console.error('allowance 호출 실패:', error);
    throw error;
  }
};

export const transferFrom = async (
  spender: string,
  from: string,
  to: string,
  amount: number
) => {
  // transferFrom함수는 컨트랙트의 transferFrom 함수를 사용하여 승인을 받은 spender가 승인한 from 주소에서 to 주소로 amount(wei 단위)만큼 토큰을 전송해야 하며, 그을 리턴해야 합니다.
  const contract = getContract();
  try {
    const tx = await contract.methods.transferFrom(from, to, amount).send({
      from: spender,
      gas: '1000000',
    });
    console.log('transferFrom 트랜잭션:', tx.transactionHash); // 디버깅용
    return tx;
  } catch (error) {
    console.error('transferFrom 호출 실패:', error);
    throw error;
  }
};


today i learned 
-스마트 컨트랙트 개발, 개발환경 설정, 컨트랙트 상호작용, 테스트 주도 개발

today i felt 
- 블록체인 개발 전반에 걸친 실습 경험 완료 (블록체인 개발의 실무 프로세스를 축소한 형태로 스마트컨트랙트~상호작용 까지 전 과정)
