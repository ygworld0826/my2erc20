import { expect } from 'chai';
import {
  getWeb3,
  getChainId,
  getOwner,
  getContract,
  totalSupply,
  balanceOf,
  transfer,
  approve,
  allowance,
  transferFrom,
} from '../web3/web3';

describe('Erc20 기능 Web3.js 검사', function () {
  let web3: any;
  let accounts: any;
  let newAddress: any;
  let recipient: any;

  before(async function () {
    web3 = await getWeb3();
    accounts = await web3.eth.getAccounts();
    newAddress = accounts[1];
    recipient = accounts[2];
  });

  describe('환경 셋팅 검사', function () {
    it('가나슈 네트워크에 정상적으로 연결이 되어야 합니다.', async function () {
      const chainId = await getChainId();
      expect(Number(chainId)).to.equal(5777);
    });

    it('getContract는 컨트랙트 인스턴스를 리턴해야 합니다.', async function () {
      const contract = getContract();
      expect(contract).to.be.instanceOf(web3.eth.Contract);
    });
  });

  describe('ERC 20 기능 검사', function () {
    it('totalSupply는 컨트랙트에 민팅된 전체 토큰의 수를 리턴해야 합니다.', async function () {
      const result = await totalSupply();
      expect(typeof result).to.equal('bigint');
    });

    it('balanceOf는 컨트랙트에 안자 address가 보유하고 있는 토큰의 양을 리턴해야 합니다.', async function () {
      const result = await balanceOf((await getOwner()).address);

      if (result === null || result === undefined) {
        throw new Error('balanceOf returned null or undefined');
      }

      const resultString = result.toString();
      const balance = web3.utils.fromWei(resultString, 'ether');
      expect(Number(balance) > 0).to.be.true;
    });

    it('transfer는 컨트랙트의 transfer함수를 사용하여 from이 to에게 amount(wei 단위)만큼 토큰을 전송해야 합니다.', async function () {
      const owner = (await getOwner()).address;

      const rawBalance = await balanceOf(newAddress);
      if (rawBalance === null || rawBalance === undefined) {
        throw new Error('balanceOf returned null or undefined');
      }

      const prevNewAddrBalance = web3.utils.fromWei(
        rawBalance.toString(),
        'ether'
      );

      await transfer(owner, newAddress, Number(web3.utils.toWei('1', 'ether')));

      const rawBalance2 = await balanceOf(newAddress);
      if (rawBalance2 === null || rawBalance2 === undefined) {
        throw new Error('balanceOf returned null or undefined');
      }

      const prevNewAddrBalance2 = web3.utils.fromWei(
        rawBalance2.toString(),
        'ether'
      );

      expect(Number(prevNewAddrBalance) < Number(prevNewAddrBalance2)).to.be
        .true;
    });

    it('transfer는 컨트랙트의 transfer함수를 사용하여 from이 to에게 amount(wei 단위)만큼 토큰을 전송해야 합니다.', async function () {
      const owner = (await getOwner()).address;

      const rawBalance = await balanceOf(newAddress);
      if (rawBalance === null || rawBalance === undefined) {
        throw new Error('balanceOf returned null or undefined');
      }

      const prevNewAddrBalance = web3.utils.fromWei(
        rawBalance.toString(),
        'ether'
      );

      await transfer(owner, newAddress, Number(web3.utils.toWei('1', 'ether')));

      const rawBalance2 = await balanceOf(newAddress);
      if (rawBalance2 === null || rawBalance2 === undefined) {
        throw new Error('balanceOf returned null or undefined');
      }

      const prevNewAddrBalance2 = web3.utils.fromWei(
        rawBalance2.toString(),
        'ether'
      );

      expect(Number(prevNewAddrBalance) < Number(prevNewAddrBalance2)).to.be
        .true;
    });

    it('approve는 컨트랙트의 approve함수를 사용하여 spender 주소로 amount(wei 단위)만큼 토큰을 승인해야 합니다.', async function () {
      await approve(newAddress, Number(web3.utils.toWei('10', 'ether')));
      const allowance = await getContract()
        .methods.allowance((await getOwner()).address, newAddress)
        .call();
      if (allowance === null || allowance === undefined) {
        throw new Error('allowance returned null or undefined');
      }

      const allowanceNum = Number(
        web3.utils.fromWei(allowance.toString(), 'ether')
      );

      expect(allowanceNum).to.equal(10);
    });

    it('allowance는 컨트랙트의 allowance함수를 사용하여 owner가 spender에게 승인한 amount(wei 단위)만큼 리턴해야 합니다.', async function () {
      const rawAllowance = await allowance(
        (await getOwner()).address,
        newAddress
      );

      if (rawAllowance === null || rawAllowance === undefined) {
        throw new Error('allowance returned null or undefined');
      }

      const allowanceNum = Number(
        web3.utils.fromWei(rawAllowance.toString(), 'ether')
      );

      expect(allowanceNum).to.equal(10);
    });

    it('transferFrom는 컨트랙트의 transferFrom함수를 사용하여 (승인받은)spender가 요청하여 (승인한)from이 to에게 amount(wei 단위)만큼 토큰을 전송해야 합니다.', async function () {
      await transferFrom(
        newAddress,
        (await getOwner()).address,
        recipient,
        Number(web3.utils.toWei('1', 'ether'))
      );

      const result = await balanceOf(recipient);
      if (result === null || result === undefined) {
        throw new Error('balanceOf returned null or undefined');
      }

      const resultString = result.toString();
      const balance = web3.utils.fromWei(resultString, 'ether');

      expect(Number(balance) > 0).to.be.true;
    });
  });
});
