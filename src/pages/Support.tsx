import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  Search,
  FileText,
  Video,
  Book
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
}

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const faqs: FAQ[] = [
    {
      id: 'faq1',
      category: 'Investment',
      question: 'How do I start investing in farming projects?',
      answer: 'To start investing, browse our Crop Explorer, select a farming project that matches your investment goals, review the farmer\'s profile and crop details, then click "Invest Now" to proceed with funding.',
      helpful: 24
    },
    {
      id: 'faq2',
      category: 'Investment',
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment varies by project, typically ranging from ₹5,000 to ₹10,000. Each crop listing shows the minimum investment required.',
      helpful: 18
    },
    {
      id: 'faq3',
      category: 'Returns',
      question: 'When do I receive returns on my investment?',
      answer: 'Returns are typically paid within 7-14 days after the harvest is completed and sold. You\'ll receive notifications throughout the process.',
      helpful: 32
    },
    {
      id: 'faq4',
      category: 'Verification',
      question: 'How are farmers and crops verified?',
      answer: 'Our certified agents physically visit farms, verify land documents, assess crop conditions, and validate farmer credentials before listing projects.',
      helpful: 15
    },
    {
      id: 'faq5',
      category: 'Wallet',
      question: 'How do I add funds to my wallet?',
      answer: 'Go to your Wallet page, click "Add Funds", choose your payment method (UPI, Net Banking, Card), enter the amount, and complete the secure payment process.',
      helpful: 27
    },
    {
      id: 'faq6',
      category: 'Risk',
      question: 'What happens if a crop fails?',
      answer: 'We have crop insurance and risk mitigation measures. In case of failure due to natural disasters, partial compensation may be available based on insurance coverage.',
      helpful: 21
    }
  ];

  const userTickets: Ticket[] = [
    {
      id: 'TKT001',
      subject: 'Investment not reflected in portfolio',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-14T10:30:00Z',
      lastUpdate: '2024-01-15T14:20:00Z'
    },
    {
      id: 'TKT002',
      subject: 'Unable to withdraw funds',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-01-10T09:15:00Z',
      lastUpdate: '2024-01-12T16:45:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.description) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in subject and description",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket Submitted Successfully",
      description: "We'll respond within 24 hours. Ticket ID: TKT003",
    });

    setTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-sm text-gray-600">Get assistance and find answers</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'ticket', label: 'Submit Ticket', icon: MessageSquare },
              { id: 'contact', label: 'Contact Us', icon: Phone },
              { id: 'resources', label: 'Resources', icon: Book }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQ Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['All', 'Investment', 'Returns', 'Verification', 'Wallet', 'Risk'].map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-white"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {/* FAQ Accordion */}
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2">
                            <p className="text-gray-600 mb-4">{faq.answer}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{faq.helpful} people found this helpful</span>
                              <div className="space-x-2">
                                <Button variant="ghost" size="sm">
                                  👍 Helpful
                                </Button>
                                <Button variant="ghost" size="sm">
                                  👎 Not helpful
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Submit Ticket Tab */}
          {activeTab === 'ticket' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* New Ticket Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select category</option>
                        <option value="investment">Investment</option>
                        <option value="wallet">Wallet & Payments</option>
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      placeholder="Detailed description of your issue..."
                      rows={6}
                    />
                  </div>

                  <Button onClick={handleSubmitTicket} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userTickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{ticket.subject}</h3>
                            <p className="text-sm text-gray-600">#{ticket.id}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                          <p>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-gray-600">+91 1800-XXX-XXXX</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-gray-600">support@harvestnexus.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-gray-600">Available on website</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Locations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Hyderabad (HQ)</h3>
                    <p className="text-gray-600 text-sm">
                      123 AgriTech Park<br/>
                      HITEC City, Hyderabad<br/>
                      Telangana - 500081
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Guntur Office</h3>
                    <p className="text-gray-600 text-sm">
                      456 Crop Market Road<br/>
                      Guntur, Andhra Pradesh<br/>
                      522001
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Video Tutorials</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Step-by-step guides for using the platform
                  </p>
                  <Button variant="outline" size="sm">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">User Guide</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Comprehensive documentation and guides
                  </p>
                  <Button variant="outline" size="sm">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Book className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Investment Tips</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn best practices for agricultural investing
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Support;
