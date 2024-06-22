import Appbar from "../components/Appbar"
import SavingsGraph from "../components/SavingsGraph"
import TransactionGraph from "../components/MonthlySavings"
import SpendingByCategory from "../components/SpendingbyCategoryGraph"
import Transactions from "../components/Transactions"

const Budget = () => {
  return (
    <div min-h-screen>
        <Appbar/>
        <SavingsGraph/>
        <SpendingByCategory/>
        <div className="min-w-screen border-2px-black">
        <TransactionGraph/>
        </div>
        <Transactions/>
    </div>
  )
}

export default Budget