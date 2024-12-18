import CategoryCreate from "@/components/category/CategoryCreate"
import CategoryList from "@/components/category/CategoryList"
export default function AdminCategory() {
  return (
    <div className="container mb-5 ">
      <div className="row">
        <div className="col">
          <h4 className="text-center"> Quản lý Danh mục</h4>
          <CategoryCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <h4 className="text-center"> Danh sách Danh mục</h4>
          <CategoryList />
        </div>
      </div>
    </div>


  )
}