# 🧭 Tourism E-commerce Website System

## 🎯 Project Purpose

In the context of rapid technological advancement and digital transformation across all sectors, the tourism industry is no exception. This project aims to design and implement a **specialized e-commerce website system for the tourism sector**, providing a smart, modern, and scalable digital platform that supports both **travelers and service providers**.

## ✅ Objectives

- Build a comprehensive online system to **support searching, booking, and managing travel services**.
- Enhance user experience through integration of advanced technologies.
- Utilize modern web development technologies
- Evaluate the **scalability, reliability, and operational efficiency** of the system in real-world conditions.


## 📌 Target

This project aims to design and implement a specialized e-commerce website system in the tourism sector that operates efficiently on web platforms and can be easily expanded in the future:

**🏗️ Modern Architecture Design**
- Design system based on modern technologies: ReactJS (frontend) and NestJS (backend)
- Ensure proper authorization, security, maintainability, and scalability
- Implement robust and extensible system architecture

**🎨 User-friendly interface**
- Develop user-friendly, smooth interfaces compatible with multiple devices
- Create responsive design for optimal cross-platform experience
- Ensure intuitive navigation and seamless user interactions

**💳 Secure Payment Integration**
- Build secure payment processes with VNPay integration
- Implement comprehensive transaction security measures
- Ensure PCI DSS compliance and fraud protection

**🔍 Advanced Database Architecture**
- Combine relational and vector databases (embedding) for semantic search capabilities
- Leverage PostgreSQL with pgvector for enhanced search functionality
- Enable natural language query processing and content discovery

**🤖 Intelligent Recommendation System**
- Integrate smart recommendation system based on Hybrid Recommendation model (CF + CBF + weighted)
- Provide personalized recommendations for each user
- Implement machine learning algorithms for continuous improvement

**💬 AI-Powered Chatbot**
- Build intelligent AI chatbot based on RAG + LLM model
- Support tour search and travel consultation
- Provide 24/7 automated customer service with natural language understanding

**☁️ Cloud Infrastructure**
- Deploy system on AWS Cloud platform
- Ensure performance, scalability, and cost optimization
- Implement auto-scaling and high availability architecture

**⚙️ Core Functionality Development**
- Build and test core functions: tour management, scheduling, promotions, shopping cart, payment, reviews, administration, and statistics
- Ensure comprehensive business process coverage
- Implement robust testing and quality assurance

**🔄 Flexible and Scalable System**
- Create open and flexibly upgradeable system
- Allow integration of advanced features such as maps, behavior analysis, service quality assessment
- Design for future enhancements and third-party integrations

---

## 👥 Main Actors
| Actor       | Role                                                                   |
|-------------|------------------------------------------------------------------------|
| Traveller   | Tourist, end user who performs tour search and booking.               |
| Supplier    | Tourism product provider (tours, schedules, discount codes...).       |
| Admin       | System administrator, handles transactions, approves content.         |

---

## 🚶 Detailed Use Cases

### 🎒 Traveller (Tourist)
- **Register / Login**: Create and access account.
- **Search tourism products**: Search by destination, time, price.
- **View tourism product details**: Description, images, available schedules, reviews.
- **Add to cart**: Save tours for booking preparation.
- **View promotion programs**: View and apply available discount codes.
- **Create bill (booking)**: Create tour booking order, pending payment.
- **Payment**: Execute transaction through electronic payment gateway supported by the system (VNPay).
- **Write reviews**: Review after completing the trip.
- **AI Chatbot**: Natural Q&A, suggestions, answer questions about suitable tourism products available in the system.
- **Manage personal account**: Update information.
- **View bill details**: View details of schedules included in the bill.
- **Pay bill**: Pay bill after placing order.
- **Create withdrawal request**: Tourist can create withdrawal request with condition that balance is greater than 0 and less than current amount.

### 🧳 Supplier (Product Provider)
- **Login**: Access management interface.
- **Create tourism product**: Post new tour (name, description, price, images, schedule).
- **Update product**: Edit tour information.
- **Discontinue product**: Hide tour from new booking list.
- **Create schedule**: Create new schedule for product with time information (booking, execution) and price.
- **Cancel schedule**: Cancel product schedule (cancel and refund bills of the schedule according to product status).
- **Complete schedule**: Mark schedule as completed and change bill status to done and add money to product supplier.
- **Create promotion**: Discount code by time or conditions.
- **Stop promotion**: Cancel discount code.
- **View schedule information**: View detailed schedule information and customers who booked the schedule.
- **Activity statistics**: Revenue, booking counts of schedules.
- **Create withdrawal request**: Supplier can create withdrawal request with condition that balance is greater than 0 and less than current amount.

### 🛠️ Admin (System Administrator)
- **User management**: Approve, lock, assign permissions.
- **Product management**: View, create, and discontinue tourism products.
- **Feedback management**: Handle complaints, bad reviews.
- **Payment management (bills)**: View bills, manually update "Paid" status.
- **View system statistics**: Users, orders, revenue.
- **Handle withdrawal requests**: Complete or cancel user withdrawal requests.

---

## ⚙️ Technologies Used
- **Frontend**: ReactJS
- **Backend**: NestJS + Prisma ORM
- **Database**: PostgreSQL + pgvector
- **Payment**: VNPAY API
- **AI**: Chatbot RAG + all-MiniLM-L6-v2
- **Recommendation System**: Hybrid Recommendation (CF + CBF)
- **Deployment**: AWS Cloud

---

## 📁 Additional Documents
- Report [(pdf)](https://drive.google.com/file/d/1WgH0HnGFBu9ACYM6vK0CJs2HRywgyIKA/view?usp=sharing)
- Use Case Diagram [(Use Case)](https://drive.google.com/file/d/13nLpEL-cHyBhUTQtYIpo7za319RYbELM/view?usp=sharing)
- System Architecture Documentation [(Link)](https://drive.google.com/file/d/1xeEKeIxrzmaFro-pkrCgSymNQ_N4wPjU/view?usp=sharing)
