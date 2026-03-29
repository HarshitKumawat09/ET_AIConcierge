"""Helper utility functions."""

import re
from typing import Any, Dict, List, Optional


def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent injection attacks."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove special characters that could be used for injection
    text = re.sub(r'[;|&$]', '', text)
    return text.strip()


def format_currency(amount: float, currency: str = "INR") -> str:
    """Format amount as currency string."""
    if currency == "INR":
        return f"₹{amount:,.2f}"
    return f"${amount:,.2f}"


def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to specified length."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def calculate_age_from_dob(dob: str) -> Optional[int]:
    """Calculate age from date of birth string."""
    from datetime import datetime
    
    try:
        # Try different date formats
        for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"]:
            try:
                birth_date = datetime.strptime(dob, fmt)
                today = datetime.now()
                age = today.year - birth_date.year
                if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
                    age -= 1
                return age
            except ValueError:
                continue
    except:
        pass
    
    return None


def determine_life_stage(age: Optional[int], family_status: str = "") -> str:
    """Determine life stage based on age and family status."""
    if age is None:
        return "unknown"
    
    if age < 25:
        return "early_career"
    elif age < 30:
        return "young_professional"
    elif age < 40:
        if "married" in family_status.lower() or "parent" in family_status.lower():
            return "young_family"
        return "mid_career"
    elif age < 50:
        return "mid_family"
    elif age < 60:
        return "pre_retirement"
    else:
        return "retirement"


def merge_dicts(base: Dict, override: Dict) -> Dict:
    """Deep merge two dictionaries."""
    result = base.copy()
    
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_dicts(result[key], value)
        else:
            result[key] = value
    
    return result


def flatten_nested_dict(d: Dict, parent_key: str = "", sep: str = ".") -> Dict:
    """Flatten a nested dictionary."""
    items = []
    
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        
        if isinstance(v, dict):
            items.extend(flatten_nested_dict(v, new_key, sep).items())
        else:
            items.append((new_key, v))
    
    return dict(items)


def safe_get(d: Dict, *keys, default: Any = None) -> Any:
    """Safely get nested dictionary values."""
    for key in keys:
        try:
            d = d[key]
        except (KeyError, TypeError):
            return default
    return d


def chunk_list(lst: List, chunk_size: int) -> List[List]:
    """Split list into chunks of specified size."""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]


def remove_duplicates(lst: List, key_func=None) -> List:
    """Remove duplicates from list while preserving order."""
    seen = set()
    result = []
    
    for item in lst:
        key = key_func(item) if key_func else item
        if key not in seen:
            seen.add(key)
            result.append(item)
    
    return result
