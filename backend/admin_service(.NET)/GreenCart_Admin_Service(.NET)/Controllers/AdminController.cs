using GreenCart_Admin_Service_.NET_.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GreenCart_Admin_Service_.NET_.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly GreencartdbContext _context;

        public AdminController(GreencartdbContext context)
        {
            _context = context;
        }

        [HttpGet("farmers")]
        public async Task<ActionResult<IEnumerable<User>>> GetFarmers()
        {
            return await _context.Users
                .Where(u => u.RoleId == 2)
                .Include(u => u.Area)
                .Include(u => u.Role)
                .ToListAsync();
        }

        [HttpGet("buyers")]
        public async Task<ActionResult<IEnumerable<User>>> GetBuyers()
        {
            return await _context.Users
                .Where(u => u.RoleId == 3)
                .Include(u => u.Area)
                .Include(u => u.Role)
                .ToListAsync();
        }

        [HttpPost("farmers/{id}/approve")]
        public async Task<ActionResult<User>> ApproveFarmer(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Status = 1; // ACTIVE
            await _context.SaveChangesAsync();

            return user;
        }

        [HttpPost("users/{id}/suspend")]
        public async Task<ActionResult<User>> SuspendUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Status = 3; // SUSPENDED
            await _context.SaveChangesAsync();

            return user;
        }

        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<ProductsStock>>> GetAllProducts()
        {
            return await _context.ProductsStocks
                .Include(ps => ps.Product)
                .Include(ps => ps.Seller)
                .ToListAsync();
        }

        [HttpPost("products/stock/{id}/toggle-visibility")]
        public async Task<ActionResult<ProductsStock>> ToggleStockVisibility(int id)
        {
            var stock = await _context.ProductsStocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(stock.Status) || stock.Status.Equals("ACTIVE", StringComparison.OrdinalIgnoreCase))
            {
                stock.Status = "HIDDEN";
            }
            else
            {
                stock.Status = "ACTIVE";
            }

            await _context.SaveChangesAsync();
            return stock;
        }

        [HttpDelete("products/stock/{id}")]
        public async Task<IActionResult> DeleteStockItem(int id)
        {
            var stock = await _context.ProductsStocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound();
            }

            _context.ProductsStocks.Remove(stock);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.Buyer)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .ToListAsync();
        }

        // --- Category Management Endpoints ---

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        [HttpPost("categories")]
        public async Task<ActionResult<Category>> SaveCategory(Category category)
        {
            if (category.CategoryId == 0)
            {
                _context.Categories.Add(category);
            }
            else
            {
                _context.Entry(category).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return category;
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.CategoryId == id);
            
            if (category == null)
            {
                return NotFound();
            }

            // Check if category has subcategories
            if (category.SubCategories.Any())
            {
                // Soft delete - mark as INACTIVE
                category.Status = "INACTIVE";
                await _context.SaveChangesAsync();
                return Ok(new { message = "Category deactivated (has subcategories)", status = "INACTIVE" });
            }
            else
            {
                // Hard delete - safe to remove
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Category permanently deleted", status = "DELETED" });
            }
        }

        [HttpPost("categories/{id}/toggle-status")]
        public async Task<ActionResult<Category>> ToggleCategoryStatus(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Toggle status
            if (string.IsNullOrEmpty(category.Status) || category.Status.Equals("ACTIVE", StringComparison.OrdinalIgnoreCase))
            {
                category.Status = "INACTIVE";
            }
            else
            {
                category.Status = "ACTIVE";
            }

            await _context.SaveChangesAsync();
            return category;
        }

        // --- SubCategory Management Endpoints ---

        [HttpGet("subcategories")]
        public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategories()
        {
            return await _context.SubCategories.Include(s => s.Category).ToListAsync();
        }

        [HttpPost("subcategories")]
        public async Task<ActionResult<SubCategory>> SaveSubCategory(SubCategory subCategory)
        {
            if (subCategory.Category != null && subCategory.Category.CategoryId != 0)
            {
                subCategory.CategoryId = subCategory.Category.CategoryId;
                subCategory.Category = null; // Prevent EF from trying to create/update category
            }

            if (subCategory.SubCategoryId == 0)
            {
                _context.SubCategories.Add(subCategory);
            }
            else
            {
                _context.Entry(subCategory).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return subCategory;
        }

        [HttpDelete("subcategories/{id}")]
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            var subCategory = await _context.SubCategories
                .Include(sc => sc.Products)
                .FirstOrDefaultAsync(sc => sc.SubCategoryId == id);
            
            if (subCategory == null)
            {
                return NotFound();
            }

            // Check if subcategory has products
            if (subCategory.Products.Any())
            {
                // Soft delete - mark as INACTIVE
                subCategory.Status = "INACTIVE";
                await _context.SaveChangesAsync();
                return Ok(new { message = "Subcategory deactivated (has products)", status = "INACTIVE" });
            }
            else
            {
                // Hard delete - safe to remove
                _context.SubCategories.Remove(subCategory);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Subcategory permanently deleted", status = "DELETED" });
            }
        }

        [HttpPost("subcategories/{id}/toggle-status")]
        public async Task<ActionResult<SubCategory>> ToggleSubCategoryStatus(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory == null)
            {
                return NotFound();
            }

            // Toggle status
            if (string.IsNullOrEmpty(subCategory.Status) || subCategory.Status.Equals("ACTIVE", StringComparison.OrdinalIgnoreCase))
            {
                subCategory.Status = "INACTIVE";
            }
            else
            {
                subCategory.Status = "ACTIVE";
            }

            await _context.SaveChangesAsync();
            return subCategory;
        }
    }
}
