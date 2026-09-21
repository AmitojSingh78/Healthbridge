import re
from typing import List, Dict, Any
from urllib.parse import urlparse
from ddgs import DDGS

PHARMACY_DOMAINS = {
    "1mg.com": {"name": "Tata 1mg", "badge": "Verified Pharmacy", "icon": "💊", "priority": 1},
    "apollopharmacy.in": {"name": "Apollo Pharmacy", "badge": "24/7 Delivery", "icon": "🏥", "priority": 1},
    "netmeds.com": {"name": "Netmeds", "badge": "Trusted Online Pharmacy", "icon": "📦", "priority": 1},
    "pharmeasy.in": {"name": "PharmEasy", "badge": "Fast Delivery", "icon": "⚡", "priority": 1},
    "medplusmart.com": {"name": "MedPlus Mart", "badge": "Retail & Online", "icon": "🏪", "priority": 2},
    "amazon.in": {"name": "Amazon Pharmacy", "badge": "Prime Delivery", "icon": "🛒", "priority": 2},
    "flipkart.com": {"name": "Flipkart Health+", "badge": "Super Fast", "icon": "🛍️", "priority": 2},
    "goodrx.com": {"name": "GoodRx", "badge": "Price Comparison", "icon": "🏷️", "priority": 3},
    "walgreens.com": {"name": "Walgreens", "badge": "US Pharmacy", "icon": "🇺🇸", "priority": 3},
    "cvs.com": {"name": "CVS Pharmacy", "badge": "US Pharmacy", "icon": "🇺🇸", "priority": 3},
}

INFO_DOMAINS = {
    "drugs.com": {"name": "Drugs.com", "badge": "Clinical Drug Guide", "icon": "📚"},
    "webmd.com": {"name": "WebMD", "badge": "Medical Encyclopedia", "icon": "🩺"},
    "practo.com": {"name": "Practo Health", "badge": "Doctor Consult & Guide", "icon": "👨‍⚕️"},
    "medlineplus.gov": {"name": "MedlinePlus (NIH)", "badge": "Official US Gov Health", "icon": "🏛️"},
    "mayoclinic.org": {"name": "Mayo Clinic", "badge": "Academic Medical Center", "icon": "🔬"},
    "healthline.com": {"name": "Healthline", "badge": "Health Resource", "icon": "🌱"},
    "rxlist.com": {"name": "RxList", "badge": "Drug Index", "icon": "📋"},
    "wikipedia.org": {"name": "Wikipedia Medical", "badge": "Pharmacology Reference", "icon": "🌐"},
}


def extract_domain(url: str) -> str:
    """Extracts the base domain from a URL."""
    try:
        netloc = urlparse(url).netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc
    except Exception:
        return ""


def identify_source(url: str) -> Dict[str, Any]:
    """Identifies the platform details from the domain."""
    domain = extract_domain(url)
    
    for key, data in PHARMACY_DOMAINS.items():
        if key in domain:
            return {
                "source": data["name"],
                "badge": data["badge"],
                "icon": data["icon"],
                "type": "pharmacy",
                "priority": data.get("priority", 2)
            }
            
    for key, data in INFO_DOMAINS.items():
        if key in domain:
            return {
                "source": data["name"],
                "badge": data["badge"],
                "icon": data["icon"],
                "type": "medical_info",
                "priority": 3
            }
            
    # Generic fallback
    clean_domain = domain.split(".")[0].capitalize() if domain else "External Portal"
    return {
        "source": clean_domain,
        "badge": "Health Portal",
        "icon": "🔗",
        "type": "other",
        "priority": 4
    }


def search_duckduckgo(query: str, max_results: int = 8) -> List[Dict[str, Any]]:
    """Runs a DuckDuckGo search and formats the results."""
    try:
        ddgs = DDGS()
        results = list(ddgs.text(query, max_results=max_results))
        formatted = []
        
        for item in results:
            title = item.get("title", "").strip()
            href = item.get("href", "").strip()
            body = item.get("body", "").strip()
            
            if not href or not title:
                continue
                
            source_info = identify_source(href)
            
            formatted.append({
                "title": title,
                "url": href,
                "snippet": body,
                "source": source_info["source"],
                "badge": source_info["badge"],
                "icon": source_info["icon"],
                "type": source_info["type"],
                "priority": source_info["priority"],
            })
            
        return formatted
    except Exception as e:
        print(f"[DuckDuckGo Search Warning] Error searching for '{query}': {e}")
        return []


def search_medicine_web_links(medicine_name: str, max_links: int = 12) -> Dict[str, List[Dict[str, Any]]]:
    """
    Executes multiple targeted searches across DuckDuckGo to collect
    both direct pharmacy purchase links and verified clinical links.
    """
    clean_name = re.sub(r"[^\w\s\-\.]", "", medicine_name).strip()
    
    # 1. Pharmacy specific searches
    pharmacy_query_1 = f"{clean_name} buy online 1mg apollo pharmacy netmeds pharmeasy"
    pharmacy_query_2 = f"buy {clean_name} price online pharmacy"
    
    # 2. Clinical information searches
    info_query = f"{clean_name} uses dosage side effects composition substitutes drugs com webmd"
    
    results_pharmacy_1 = search_duckduckgo(pharmacy_query_1, max_results=6)
    results_pharmacy_2 = search_duckduckgo(pharmacy_query_2, max_results=5)
    results_info = search_duckduckgo(info_query, max_results=6)
    
    # Merge and deduplicate by URL
    seen_urls = set()
    all_links = []
    
    for item in results_pharmacy_1 + results_pharmacy_2 + results_info:
        url = item.get("url", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
            all_links.append(item)
            
    # Partition into pharmacy buy links and medical info links
    buy_links = [l for l in all_links if l["type"] == "pharmacy"]
    info_links = [l for l in all_links if l["type"] in ("medical_info", "other")]
    
    # Sort pharmacy links by priority
    buy_links.sort(key=lambda x: x.get("priority", 99))
    
    # If no pharmacy links were found via strict domain match, include top relevant search links
    if not buy_links and all_links:
        buy_links = all_links[:3]
        
    return {
        "buy_links": buy_links[:8],
        "info_links": info_links[:6],
        "raw_results": all_links[:max_links]
    }
